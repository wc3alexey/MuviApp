import { format } from 'date-fns';


const formatDateRelease = (dataStr) => {
  return format(new Date(dataStr), 'MMM Q, y');
};

export default formatDateRelease;
