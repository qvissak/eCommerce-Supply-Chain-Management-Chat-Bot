const moment = require('moment');

/**
 * Helper function to return date time from various date-intents
 * @param {Object} session - current conversation data
 * @param {Object} dateTime - date from entity on LUIS
 */
const getDateTime = (session, dateTime) => {
  if (!dateTime) return undefined;
  const { values } = dateTime.resolution;
  if (values[0].type === 'date') {
    const possibilities = values.map(date => date.value).filter(date => date <= moment());
    if (possibilities.length > 1) {
      // TODO: display on GUI
      session.send('To which date were you referring?');
      possibilities.forEach((date, i) => session.send(`${i + 1}. ${date}.`));
      // get selection
      // return { start: , end: };
    }
    return { start: possibilities[0], end: possibilities[0] };
  } else if (values[0].type === 'daterange') {
    if (values.length > 1) {
      // filter out future dates
      const valuesFiltered = values[0].start
        ? values.filter(daterange => Date.parse(daterange.start) <= moment())
        : values.filter(daterange => Date.parse(daterange.end) <= moment());
      // replace 'undefined' value for unspecified range
      const possibilities = valuesFiltered[0].start
        ? valuesFiltered.map(daterange => `${daterange.start} to ${moment().format('MM-DD-YYYY')}`)
        : valuesFiltered.map(daterange => `${moment().subtract(14, 'days').format('MM-DD-YYYY')} to ${daterange.end}`);
      if (possibilities.length > 1) {
        session.send('To which date range were you referring?');
        possibilities.forEach((daterange, i) => session.send(`${i + 1}. ${daterange}?`));
        // get selection
        // return { start: , end: };
      }
      return { start: valuesFiltered[0].start, end: valuesFiltered[0].end };
    }
    return { start: values[0].start, end: values[0].end };
  } else if (values[0].type === 'datetimerange') {
    if (values[0].Mod && values.length > 1) {
      const possibilities = values.map(datetimerange => `${datetimerange.Mod} ${datetimerange.start}`);
      // TODO: display on GUI
      session.send('To which datetime range were you referring?');
      possibilities.forEach((datetimerange, i) => session.send(`${i + 1}. ${datetimerange}?`));
      // get selection
      // return { start: , end: };
    } else if (values.length > 1) {
      // filter out future dates
      const valuesFiltered = values[0].start
        ? values.filter(daterange => Date.parse(daterange.start) <= moment())
        : values.filter(daterange => Date.parse(daterange.end) <= moment());
      // replace 'undefined' value for unspecified range
      const possibilities = valuesFiltered[0].start
        ? valuesFiltered.map(datetimerange => `${datetimerange.start} to ${moment().format('MM-DD-YYYY')}`)
        : valuesFiltered.map(datetimerange => `${moment().subtract(14, 'days').format('MM-DD-YYYY')} to ${datetimerange.end}`);
      if (possibilities.length > 1) {
        // TODO: display on GUI
        session.send('To which datetime range were you referring?');
        possibilities.forEach((datetimerange, i) => session.send(`${i + 1}. ${datetimerange}`));
        // get selection
        // return { start: , end: };
      }
      return { start: valuesFiltered[0].start, end: valuesFiltered[0].end };
    }
    return { start: values[0].start, end: values[0].end };
  }
  return undefined;
};

module.exports = {
  getDateTime,
};
