import moment from 'moment';

export const friendlyDate = (date: Date = new Date()) =>
    moment(date).format('yyy-MM-DD HH:mm');

export const getExpiryDateUtc = (timeTillExpiry: number) =>
    moment().add(timeTillExpiry, 'seconds').utc().toDate();

export const isInTheFuture = (orig: Date): boolean => {
    // console.log({ orig });
    // console.log(moment(orig).toDate());
    // console.log(moment().toDate());
    // console.log(moment(orig).isAfter(moment()));
    // console.log('---');
    return moment(orig).isAfter(moment());
}

export const isInThePast = (orig: Date): boolean => {
    return moment(orig).isBefore(moment());
}

export const oneHourFromNow = (): Date =>
    moment().add(1, 'hour').toDate();