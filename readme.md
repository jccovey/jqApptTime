jqApptTime
==========

Specialized, jQuery date and/or time picker for appointments, reservations, etc.

Usage
-----

Call .jqApptTime() on a jQuery object containing one or more input[type="text"] elements:

    // Time only
    $(".time").jqApptTime({date: false, time: true});

    // Date only
    $(".date").jqApptTime({date: true, time: false});

    // Date and time
    $(".datetime").jqApptTime();