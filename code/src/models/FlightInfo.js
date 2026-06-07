export class FlightInfo {
  constructor(props = {}) {
    this.terminal = props.terminal?.trim() || '';
    this.type = props.type?.trim() || ''; // A: Arrival, D: Departure
    this.airlineCode = props.airlineCode?.trim() || '';
    this.airlineNameZH = props.airlineNameZH?.trim() || '';
    this.flightNumber = props.flightNumber?.trim() || '';
    this.gate = props.gate?.trim() || '';
    this.scheduledDate = props.scheduledDate?.trim() || '';
    this.scheduledTime = props.scheduledTime?.trim() || '';
    this.estimatedDate = props.estimatedDate?.trim() || '';
    this.estimatedTime = props.estimatedTime?.trim() || '';
    this.destinationIATA = props.destinationIATA?.trim() || '';
    this.originIATA = props.originIATA?.trim() || '';
    this.destinationEN = props.destinationEN?.trim() || '';
    this.originEN = props.originEN?.trim() || '';
    this.destinationZH = props.destinationZH?.trim() || '';
    this.originZH = props.originZH?.trim() || '';
    this.flightStatus = props.flightStatus?.trim() || '';
    this.aircraftType = props.aircraftType?.trim() || '';
    this.viaIATA = props.viaIATA?.trim() || '';
    this.viaEN = props.viaEN?.trim() || '';
    this.viaZH = props.viaZH?.trim() || '';
    this.baggageCarousel = props.baggageCarousel?.trim() || '';
    this.checkInCounter = props.checkInCounter?.trim() || '';
    this.statusZH = props.statusZH?.trim() || '';
    this.statusEN = props.statusEN?.trim() || '';
    this.airlineLogo = props.airlineLogo?.trim() || '';
  }

  get fullFlightNumber() {
    return `${this.airlineCode}${this.flightNumber}`;
  }

  get scheduledDateTime() {
    if (!this.scheduledDate || !this.scheduledTime) return null;
    return new Date(`${this.scheduledDate.replace(/\//g, '-')}T${this.scheduledTime}`);
  }

  get estimatedDateTime() {
    if (!this.estimatedDate || !this.estimatedTime) return null;
    return new Date(`${this.estimatedDate.replace(/\//g, '-')}T${this.estimatedTime}`);
  }
}
