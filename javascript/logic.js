       //Initialize Firebase
       var firebaseConfig = {
         apiKey: "AIzaSyA-QagZOkfifJ3DwdIOl0yIE54Zsz9SEtg",
         authDomain: "train-schedule-f5b2d.firebaseapp.com",
         databaseURL: "https://train-schedule-f5b2d.firebaseio.com",
         projectId: "train-schedule-f5b2d",
         storageBucket: "train-schedule-f5b2d.appspot.com",
         messagingSenderId: "843986272923",
         appId: "1:843986272923:web:a01674760176fb61"
       };
       // Initialize Firebase
       firebase.initializeApp(firebaseConfig);

       var database = firebase.database();


       $("#submit-button").on("click", function (event) {
         event.preventDefault();

         //Grabs user Input
         var input = $("input");
         var tName = $("#train-name").val().trim();
         var tDestination = $("#train-destination").val().trim();
         var tFirstTime = moment($("#train-first-time").val().trim(), "HH:mm");
         var tFrequency = parseInt($("#train-frequency").val().trim());



         //Creates local object for holding train data
         var newTrain = {
           name: tName,
           destination: tDestination,
           firstTime: tFirstTime.format("HH:mm"),
           frequency: tFrequency
         };
         $("#train-first-Time").attr("class", "form-group");

         $("#helpBlock").text("");


         //Code for pushing train data to Firebase
         database.ref().push(newTrain);

         console.log(newTrain.name);
         console.log(newTrain.destination);
         console.log(newTrain.firstTime);
         console.log(newTrain.frequency);

         //Clear all of text-boxes
         $("#train-name").val("");
         $("#train-destination").val("");
         $("#train-first-time").val("");
         $("#train-frequency").val("");

       });

       //Firebase watcher + initial loader
       database.ref().on("child_added", function (childSnapshot) {

         var tName = (childSnapshot.val().name);
         var tDestination = (childSnapshot.val().destination);
         var tFirstTime = (childSnapshot.val().firstTime)
         var tFrequency = (childSnapshot.val().frequency);


         var convertedTime = moment(tFirstTime, "HH:mm").subtract(1, "years");
         console.log(convertedTime);

         //Current Time
         var currentTime = moment();

         //Difference between the times
         var diffTime = moment().diff(moment(convertedTime), "minutes");
         console.log("Differennce in time: " + diffTime);

         //Time apart
         var tRemainder = diffTime % tFrequency;
         console.log(tRemainder);

         //Minutes Until Train
         var minutesAway = tFrequency - tRemainder;
         console.log("Minutes until train: " + minutesAway);

         //Next Train
         var nextArrival = moment().add(minutesAway, "minutes");
         console.log("Arrival time: " + moment(nextArrival).format("HH:mm"));


         //Create the new row
         var newRow = $("<tr>").append(
           $("<td>").text(tName),
           $("<td>").text(tDestination),
           $("<td>").text(tFrequency),
           $("<td>").text(nextArrival.format("HH:mm")),
           $("<td>").text(minutesAway)
         );

         //Append the new row to the table
         $("#full-table").append(newRow);
       })