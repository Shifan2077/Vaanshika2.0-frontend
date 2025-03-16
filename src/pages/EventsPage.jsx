// File: src/pages/EventsPage.jsx
// Modern events page with calendar view and event management

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import { demoEventsData } from '../utils/demoData';
import { 
  FaCalendarAlt, 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaTimes, 
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaUsers,
  FaMapMarkerAlt,
  FaClock,
  FaInfoCircle
} from 'react-icons/fa';

// Setup the localizer for the calendar
const localizer = momentLocalizer(moment);

const EventsPage = () => {
  const { user } = useAuth();
  const { getEvents, createEvent, updateEvent, deleteEvent } = useEvents();
  
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
    location: '',
    allDay: false,
    attendees: [],
    color: '#3174ad'
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [calendarView, setCalendarView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Load events from demo data instead of API
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        // Transform demo data to the format expected by react-big-calendar
        const formattedEvents = demoEventsData.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          start: new Date(event.date + 'T' + event.time.start),
          end: new Date(event.date + 'T' + event.time.end),
          location: event.location,
          allDay: event.allDay || false,
          attendees: event.attendees || [],
          color: event.type === 'birthday' ? '#FF5722' : 
                 event.type === 'anniversary' ? '#9C27B0' : 
                 event.type === 'family-gathering' ? '#4CAF50' : 
                 event.type === 'religious' ? '#FFC107' : '#3174ad',
          organizer: event.organizer,
          photos: event.photos,
          type: event.type,
          recurrence: event.recurrence
        }));
        
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, []);
  
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };
  
  const handleSelectSlot = ({ start, end }) => {
    setEventFormData({
      ...eventFormData,
      start,
      end,
      title: '',
      description: '',
      location: '',
      allDay: false,
      attendees: [],
      color: '#3174ad'
    });
    setIsEditMode(false);
    setShowEventModal(true);
  };
  
  const handleEditEvent = () => {
    if (!selectedEvent) return;
    
    setEventFormData({
      id: selectedEvent.id,
      title: selectedEvent.title,
      description: selectedEvent.description || '',
      start: selectedEvent.start,
      end: selectedEvent.end,
      location: selectedEvent.location || '',
      allDay: selectedEvent.allDay || false,
      attendees: selectedEvent.attendees || [],
      color: selectedEvent.color || '#3174ad'
    });
    
    setIsEditMode(true);
    setShowEventModal(true);
    setSelectedEvent(null);
  };
  
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      // In demo mode, just filter out the event from the state
      setEvents(prevEvents => prevEvents.filter(event => event.id !== selectedEvent.id));
      setSelectedEvent(null);
      
      // Show success notification
      alert('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventFormData({
      ...eventFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleDateChange = (name, date) => {
    setEventFormData({
      ...eventFormData,
      [name]: date
    });
  };
  
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditMode) {
        // Update existing event in demo mode
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === eventFormData.id ? { ...eventFormData } : event
          )
        );
        alert('Event updated successfully');
      } else {
        // Create new event in demo mode
        const newEvent = {
          ...eventFormData,
          id: `event-${Date.now()}`, // Generate a unique ID
          createdBy: user.uid,
          createdAt: new Date()
        };
        
        setEvents(prevEvents => [...prevEvents, newEvent]);
        alert('Event created successfully');
      }
      
      // Reset form and close modal
      setEventFormData({
        title: '',
        description: '',
        start: new Date(),
        end: new Date(new Date().setHours(new Date().getHours() + 1)),
        location: '',
        allDay: false,
        attendees: [],
        color: '#3174ad'
      });
      setShowEventModal(false);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
    }
  };
  
  // Format date for display
  const formatDate = (date) => {
    return moment(date).format('MMMM D, YYYY');
  };
  
  // Format time for display
  const formatTime = (date) => {
    return moment(date).format('h:mm A');
  };
  
  // Navigate to previous period
  const handleNavigatePrev = () => {
    const newDate = new Date(currentDate);
    
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (calendarView === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    }
    
    setCurrentDate(newDate);
  };
  
  // Navigate to next period
  const handleNavigateNext = () => {
    const newDate = new Date(currentDate);
    
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (calendarView === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    }
    
    setCurrentDate(newDate);
  };
  
  // Navigate to today
  const handleNavigateToday = () => {
    setCurrentDate(new Date());
  };
  
  // Get calendar title based on current view and date
  const getCalendarTitle = () => {
    if (calendarView === 'month') {
      return moment(currentDate).format('MMMM YYYY');
    } else if (calendarView === 'week') {
      const startOfWeek = moment(currentDate).startOf('week');
      const endOfWeek = moment(currentDate).endOf('week');
      
      if (startOfWeek.month() === endOfWeek.month()) {
        return `${startOfWeek.format('MMM D')} - ${endOfWeek.format('D, YYYY')}`;
      } else if (startOfWeek.year() === endOfWeek.year()) {
        return `${startOfWeek.format('MMM D')} - ${endOfWeek.format('MMM D, YYYY')}`;
      } else {
        return `${startOfWeek.format('MMM D, YYYY')} - ${endOfWeek.format('MMM D, YYYY')}`;
      }
    } else if (calendarView === 'day') {
      return moment(currentDate).format('dddd, MMMM D, YYYY');
    }
    
    return '';
  };
  
  // Custom event component for the calendar
  const EventComponent = ({ event }) => (
    <div
      className="text-xs p-1 overflow-hidden text-ellipsis whitespace-nowrap rounded"
      style={{ backgroundColor: event.color || '#3174ad', color: 'white' }}
    >
      {event.title}
    </div>
  );
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              Family Events
            </h1>
            <p className="mt-1 text-neutral-600">
              Manage and track important family events
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => {
                setEventFormData({
                  ...eventFormData,
                  start: new Date(),
                  end: new Date(new Date().setHours(new Date().getHours() + 1))
                });
                setIsEditMode(false);
                setShowEventModal(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <FaPlus className="mr-2" />
              Add Event
            </button>
          </div>
        </div>
         */}
        {/* Calendar toolbar */}
        <div className="glassmorphism bg-white bg-opacity-70 backdrop-blur-lg rounded-xl shadow-md p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              <button
                onClick={handleNavigatePrev}
                className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <FaChevronLeft className="h-4 w-4 text-neutral-700" />
              </button>
              
              <button
                onClick={handleNavigateToday}
                className="mx-2 px-3 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
              >
                Today
              </button>
              
              <button
                onClick={handleNavigateNext}
                className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <FaChevronRight className="h-4 w-4 text-neutral-700" />
              </button>
              
              <h2 className="m-0 text-lg font-medium text-neutral-900">
                {getCalendarTitle()}
              </h2>
            </div>
            
            <div className="inline-flex rounded-lg shadow-sm">
              <button
                onClick={() => setCalendarView('month')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  calendarView === 'month'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setCalendarView('week')}
                className={`px-4 py-2 text-sm font-medium ${
                  calendarView === 'week'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setCalendarView('day')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  calendarView === 'day'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                Day
              </button>
            </div>
          </div>
        </div>
        
        {/* Calendar and event details */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="glassmorphism bg-white bg-opacity-70 backdrop-blur-lg rounded-xl shadow-md p-4 h-[600px]">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  views={['month', 'week', 'day']}
                  view={calendarView}
                  date={currentDate}
                  onNavigate={setCurrentDate}
                  onView={setCalendarView}
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleSelectSlot}
                  selectable
                  popup
                  components={{
                    event: EventComponent
                  }}
                  eventPropGetter={(event) => ({
                    style: {
                      backgroundColor: event.color || '#3174ad'
                    }
                  })}
                  className="custom-calendar"
                />
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="glassmorphism bg-white bg-opacity-70 backdrop-blur-lg rounded-xl shadow-md p-6 h-[600px] overflow-y-auto"
            >
              {selectedEvent ? (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-neutral-900">
                      {selectedEvent.title}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleEditEvent}
                        className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
                      >
                        <FaEdit className="h-4 w-4 text-neutral-700" />
                      </button>
                      <button
                        onClick={handleDeleteEvent}
                        className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
                      >
                        <FaTrash className="h-4 w-4 text-neutral-700" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <FaCalendarAlt className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-neutral-900">
                          {selectedEvent.allDay ? (
                            formatDate(selectedEvent.start)
                          ) : (
                            <>
                              {formatDate(selectedEvent.start)}
                              <br />
                              {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
                            </>
                          )}
                        </p>
                        {selectedEvent.allDay && (
                          <p className="text-xs text-neutral-500">All day</p>
                        )}
                      </div>
                    </div>
                    
                    {selectedEvent.location && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <FaMapMarkerAlt className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-neutral-900">{selectedEvent.location}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedEvent.description && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <FaInfoCircle className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-neutral-900">{selectedEvent.description}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <FaUsers className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-neutral-900">Attendees</p>
                          <ul className="mt-1 space-y-1">
                            {selectedEvent.attendees.map((attendee, index) => (
                              <li key={index} className="text-sm text-neutral-700">
                                {attendee.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <FaCalendarAlt className="h-12 w-12 text-neutral-300 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No event selected</h3>
                  <p className="text-neutral-600 mb-6">
                    Select an event from the calendar or create a new one
                  </p>
                  <button
                    onClick={() => {
                      setEventFormData({
                        ...eventFormData,
                        start: new Date(),
                        end: new Date(new Date().setHours(new Date().getHours() + 1))
                      });
                      setIsEditMode(false);
                      setShowEventModal(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    <FaPlus className="mr-2" />
                    Add Event
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Event modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div 
            className="glassmorphism bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-neutral-900">
                {isEditMode ? 'Edit Event' : 'Add New Event'}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <FaTimes className="h-4 w-4 text-neutral-700" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitEvent}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
                    Event Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={eventFormData.title}
                    onChange={handleInputChange}
                    className="form-input w-full rounded-lg"
                    placeholder="Enter event title"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={eventFormData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="form-textarea w-full rounded-lg"
                    placeholder="Enter event description"
                  ></textarea>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allDay"
                    name="allDay"
                    checked={eventFormData.allDay}
                    onChange={handleInputChange}
                    className="form-checkbox h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="allDay" className="ml-2 block text-sm text-neutral-700">
                    All day event
                  </label>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start" className="block text-sm font-medium text-neutral-700 mb-1">
                      Start Date*
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={moment(eventFormData.start).format('YYYY-MM-DD')}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        const currentStart = new Date(eventFormData.start);
                        newDate.setHours(currentStart.getHours());
                        newDate.setMinutes(currentStart.getMinutes());
                        handleDateChange('start', newDate);
                      }}
                      className="form-input w-full rounded-lg"
                      required
                    />
                  </div>
                  
                  {!eventFormData.allDay && (
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium text-neutral-700 mb-1">
                        Start Time*
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={moment(eventFormData.start).format('HH:mm')}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':');
                          const newDate = new Date(eventFormData.start);
                          newDate.setHours(parseInt(hours));
                          newDate.setMinutes(parseInt(minutes));
                          handleDateChange('start', newDate);
                        }}
                        className="form-input w-full rounded-lg"
                        required
                      />
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="end" className="block text-sm font-medium text-neutral-700 mb-1">
                      End Date*
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={moment(eventFormData.end).format('YYYY-MM-DD')}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        const currentEnd = new Date(eventFormData.end);
                        newDate.setHours(currentEnd.getHours());
                        newDate.setMinutes(currentEnd.getMinutes());
                        handleDateChange('end', newDate);
                      }}
                      className="form-input w-full rounded-lg"
                      required
                    />
                  </div>
                  
                  {!eventFormData.allDay && (
                    <div>
                      <label htmlFor="endTime" className="block text-sm font-medium text-neutral-700 mb-1">
                        End Time*
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={moment(eventFormData.end).format('HH:mm')}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':');
                          const newDate = new Date(eventFormData.end);
                          newDate.setHours(parseInt(hours));
                          newDate.setMinutes(parseInt(minutes));
                          handleDateChange('end', newDate);
                        }}
                        className="form-input w-full rounded-lg"
                        required
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={eventFormData.location}
                    onChange={handleInputChange}
                    className="form-input w-full rounded-lg"
                    placeholder="Enter event location"
                  />
                </div>
                
                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-neutral-700 mb-1">
                    Event Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      id="color"
                      name="color"
                      value={eventFormData.color}
                      onChange={handleInputChange}
                      className="form-input h-8 w-8 p-0 border-0"
                    />
                    <span className="ml-2 text-sm text-neutral-500">
                      Choose a color for the event
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  {isEditMode ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage; 