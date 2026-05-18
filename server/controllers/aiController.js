const Groq = require('groq-sdk');
const Booking = require('../models/Booking');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateSummary = async (req, res) => {
  const { bookingId, sessionNotes, difficulties } = req.body;

  if (!sessionNotes || sessionNotes.trim().length < 10) {
    return res.status(400).json({ message: 'Please provide meaningful session notes.' });
  }

  try {
    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id }).populate('service');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{
        role: 'user',
        content: `You are an educational assistant helping students summarize their tutoring sessions.

Session: ${booking.service?.title} (${booking.service?.subject})
Notes: "${sessionNotes}"
Difficulties: "${difficulties || 'None'}"

Generate a structured summary with:
1. **Session Overview**
2. **Key Topics Covered**
3. **Main Takeaways**
4. **Suggested Follow-Up Topics**
5. **Encouragement**`
      }],
    });

    const summary = completion.choices[0].message.content;
    booking.aiSummary = summary;
    booking.notes = sessionNotes;
    booking.status = 'completed';
    await booking.save();

    res.json({ summary, bookingId });
  } catch (err) {
    console.error('AI summary error:', err.message);
    res.status(500).json({ message: 'Failed to generate summary. Please try again.' });
  }
};

module.exports = { generateSummary };