import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | TutorFlow` : 'TutorFlow';
  }, [title]);
};

export default usePageTitle;