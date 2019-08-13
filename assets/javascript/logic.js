$(document).ready(function () {

    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyAwC-iZdMk3XUpL0JMve3-g53XCWnht5EI",
        authDomain: "btgoligowski24-trainactivity.firebaseapp.com",
        databaseURL: "https://btgoligowski24-trainactivity.firebaseio.com",
        projectId: "btgoligowski24-trainactivity",
        storageBucket: "",
        messagingSenderId: "548245298045",
        appId: "1:548245298045:web:bf8031f14ffb168a"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();
    var trains = firebase.database().ref("/trains");

    function formValidation() {
        var newTrain = $("#trainName").val().trim();
        var newDestination = $("#destination").val().trim();
        var newFirstTime = $("#firstTrain").val().trim();
        var newFrequency = $("#frequency").val().trim();

        if (!newTrain || !newDestination || !newFirstTime || !newFrequency) {
            if (!newTrain) {
                alert("You must a name for your train!");
                $("#trainName").addClass("inputError");
            }
            if (!newDestination) {
                $("#trainName").removeClass("inputError");
                alert("You must enter a destination!");
                $("#destination").addClass("inputError");
            }
            if (!newFirstTime) {
                $("#trainName").removeClass("inputError");
                $("#destination").removeClass("inputError");
                alert("You must enter a start time for your train!");
                $("#firstTrain").addClass("inputError");
            }
            if (!newFrequency) {
                $("#trainName").removeClass("inputError");
                $("#destination").removeClass("inputError");
                $("#firstTrain").removeClass("inputError");
                alert("You must set a frequency for your train!");
                $("#frequency").addClass("inputError");
            }
            return false
        } else {
            $("#trainName").removeClass("inputError");
            $("#destination").removeClass("inputError");
            $("#firstTrain").removeClass("inputError");
            $("#frequency").removeClass("inputError");
        }

        if (!Number.isInteger(parseInt(newFrequency))) {
            alert("You need to enter an integer number for frequency");
            $("#frequency").addClass("inputError");
            return false
        }
        $("#frequency").removeClass("inputError");

        if (!/(^[0-1]\d:[0-5]\d$)|(^2[0-3]:[0-5]\d$)/.test(newFirstTime)) {
            alert("You need a properly formatted military time (i.e. 21:00).");
            $("#firstTrain").addClass("inputError");
            return false
        }
        $("#firstTrain").removeClass("inputError");
        return true
    }

    function addTrain() {
        if (!formValidation()) {
            return
        }

        var newTrain = $("#trainName").val().trim();
        var newDestination = $("#destination").val().trim();
        var newFirstTime = $("#firstTrain").val().trim();
        var newFrequency = $("#frequency").val().trim();

        trains.push({
            train: newTrain,
            destination: newDestination,
            firstTime: newFirstTime,
            frequency: newFrequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        })

        $("#trainName").val("");
        $("#destination").val("");
        $("#firstTrain").val("");
        $("#frequency").val("");
    }

    trains.orderByChild("dateAdded").on("child_added", function (snapshot) {
        var newMember = snapshot.val();
        var momentFormat = "HH:mm";
        var firstTime = moment(newMember.firstTime, momentFormat);
        var trainFrequency = parseInt(newMember.frequency);
        var newRowElem = $("<tr>");
        var newRemoveElem = $("<td>");
        var newRemoveButton = $("<button class=\"btn btn-sm btn-danger remove\">")
        var newTrainElem = $("<td>");
        var newDestinationElem = $("<td>");
        var newFrequencyElem = $("<td>");
        var newArrivalElem = $("<td>");
        var newMinutesAwayElem = $("<td>");
        var minutesElapsed = moment().diff(firstTime, "minutes");
        var minutesAway = trainFrequency - (minutesElapsed % trainFrequency);
        var nextArrival = moment(firstTime.add(trainFrequency * (Math.ceil(minutesElapsed / trainFrequency)), "m")).format("hh:mm A");

        newTrainElem.text(newMember.train);
        newDestinationElem.text(newMember.destination);
        newFrequencyElem.text(newMember.frequency);
        newArrivalElem.text(nextArrival);
        newMinutesAwayElem.text(minutesAway);
        newRemoveButton.text("Remove");
        newRemoveButton.attr("data-key",snapshot.key);

        $(newRowElem).append(newTrainElem);
        $(newRowElem).append(newDestinationElem);
        $(newRowElem).append(newFrequencyElem);
        $(newRowElem).append(newArrivalElem);
        $(newRowElem).append(newMinutesAwayElem);
        $(newRemoveElem).append(newRemoveButton);
        $(newRowElem).append(newRemoveElem);
        $("#trainSchedule").append(newRowElem);
    })

    $("#submit").on("click", addTrain);
    $("table").on("click", ".remove", function () {
        database.ref("/trains/" + $(this).attr("data-key")).remove();
        $(this).parents().eq(1).remove()
    })

})