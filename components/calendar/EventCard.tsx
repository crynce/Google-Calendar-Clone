
import { Event } from '@/types';
import { FiClock, FiTag } from 'react-icons/fi';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <div className="bg-blue-500 text-white p-2 rounded-lg text-sm shadow-md hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
      <p className="font-bold flex items-center space-x-1"><FiTag /><span>{event.title}</span></p>
      <p className="flex items-center space-x-1"><FiClock /><span>{event.startTime} - {event.endTime}</span></p>
    </div>
  );
};

export default EventCard;
