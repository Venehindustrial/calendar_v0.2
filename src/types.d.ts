type EventInfo = {
  id: string;
  namePublisher: string;
  emailPublisher: string;
  //phonePublisher: string;
  eventName: string;
  date: string;
  hour: string;
  //hourlyUse: string;
  typeEvent: string;
  eventLink: string;
  form: string;
  specialist: string;
  //place: string;
  //link: string;
  //questions: string;
};

type ModalData = {
  date: Date;
  events: EventInfo[];
};

type MonthInfo = {
  startDate: Date;
  events: EventInfo[];
};
