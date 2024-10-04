import React, { useEffect } from "react";
import AppNavigator from "./Screens/navigation/AppNavigator";
import { registerTranslation } from "react-native-paper-dates";
import Orientation from 'react-native-orientation-locker';

registerTranslation('en-GB', {
    save: 'Save',
    selectSingle: 'Select date',
    selectMultiple: 'Select dates',
    selectRange: 'Select period',
    notAccordingToDateFormat: (inputFormat) =>
        `Date format must be ${inputFormat}`,
    mustBeHigherThan: (date) => `Must be later then ${date}`,
    mustBeLowerThan: (date) => `Must be earlier then ${date}`,
    mustBeBetween: (startDate, endDate) =>
        `Must be between ${startDate} - ${endDate}`,
    dateIsDisabled: 'Day is not allowed',
    previous: 'Previous',
    next: 'Next',
    typeInDate: 'Type in date',
    pickDateFromCalendar: 'Pick date from calendar',
    close: 'Close',
})

export default function App() {
    useEffect(() => {
        Orientation.lockToPortrait();
    }, []);

    return <AppNavigator />;
}