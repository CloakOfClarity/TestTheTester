var question = 0; var mark = 0; var qid = 0; var prevQuest = [];

function selectQuestion()
{
	qid = getRandomQuestion();
	question += 1;
	$("h2>span").text(question); // display current question out of 20
	$("main>p").html(getQuestionText(qid)); // display question text
	$("main>div").empty();
	if(typeof ql[qid].correct=="number")
	{ // display the multiple choices as radio buttons
		for (let i = 0; i < ql[qid].answers.length; i++)
		{ // loop through the multiple choices
			addRadioButton(qid,i);
		} // end for loop
	} else { // display the multiple choices as checkboxes
		for (let i = 0; i < ql[qid].answers.length; i++)
		{ // loop through the multiple choices
			addCheckbox(qid,i);
		} // end for loop
	} // end if statement
} // end selectQuestion function

function getRandomQuestion()
{
	var id;
	do
	{ // randomly select one of the questions in the ql array
		id = Math.floor(Math.random() * ql.length);
	} while(prevQuest.indexOf(id)>=0)
// use prevQuest to keep track of questions that have already been asked
	prevQuest.push(id);
	return id;
} // end getRandomQuestion function

function getQuestionText(id)
{
// use regular expression to turn all pipe characters in the question text into line breaks
	return ql[id].question.replace(/\|/g,"<br>");
} // end getQuestionText function

function addRadioButton(q,a)
{
// create containing div element and assign it the radio class
	$("main>div").append($("<div></div>").attr("class","radio"));
// create the input element and make it a radio button with radio class
	$("main>div>div:last").append($("<input/>").attr({"type":"radio","id":"answer"+a,"name":"answers","value":a,"class":"radio"}));
// create the label element for the input and assign it the answer text
	$("main>div>div:last").append($("<label></label>").attr("for","answer"+a).text(ql[q].answers[a]));
} // end addRadioButton function

function addCheckbox(q,a)
{
// create containing div element and assign it the form-check class
	$("main>div").append($("<div></div>").attr("class","form-check"));
// create the input element and make it a checkbox with form-check-input class
	$("main>div>div:last").append($("<input/>").attr({"type":"checkbox","id":"answer"+a,"name":"answers","value":a,"class":"form-check-input"}));
// create the label element for the input and assign it the answer text
	$("main>div>div:last").append($("<label></label>").attr({"for":"answer"+a,"class":"form-check-label"}).text(ql[q].answers[a]));
} // end addCheckbox function

function checkResponse()
{
	if($("button").text()=="Submit Answer")
	{ // execute code if an answer is being submitted
		if($(":checked").length>0)
		{ // only execute function if at least one answer is selected
			if (typeof ql[qid].correct == "number")
			{ // check if the selected radio button is the correct answer
				validateRadio($(":checked").val());
			} else { // check if the selected checkboxes are the correct answers
				validateCheck()
			} // end if statement
			let perc = Math.floor((mark / question) * 100);
			$("header span").text(perc+"%"); // display mark as a percentage
			if(perc<60)
			{ // set mark colour to red if the user is failing the quiz
				$("header span").attr("class","failmark");
			} else if(mark<70) { // set mark colour to red if the user is close to failing the quiz
				$("header span").attr("class","dangermark");
			} else { // set mark colour to red if the user is passing the quiz
				$("header span").attr("class","passmark");
			} // end if statement
			if(question<20)
			{ // update button text to move to the next question
				$("button").text("Next Question");
			} else { // update button text to move to the results screen
				$("button").text("View Results");
			} // end button if statement
		} // end code to execute if at least one answer is selected
	} else { // if currently on feedback screen
		if(question<20)
		{ // execute if moving to the next question
			$("button").text("Submit Answer");
			selectQuestion();
		} else { // display results screen
			completeQuiz();
		} // end if statement
	} // end code to execute if on feedback screen
} // end checkResponse function

function validateRadio(sel)
{
	$("main>div").empty();
	$("main>div").append($("<p></p>").html("You selected &#8216;"+ql[qid].answers[sel]+"&#8217;."));
	if(sel==ql[qid].correct)
	{ // the correct response was selected
		$("main>div").append($("<p></p>").text("Congratulations! You selected the correct answer.").attr("class","passmark"));
		mark += 1;
	} else { // the incorrect response was selected
		$("main>div").append($("<p></p>").html("Sorry, you selected the incorrect answer. The correct answer was &#8216;"+ql[qid].answers[ql[qid].correct]+"&#8217;.").attr("class","failmark"));
	} // end if statement
} // end validateRadio function

function validateCheck()
{
	let sol = ""; let subMark = 0;
	for(let i=0;i<ql[qid].answers.length;i++)
	{ // loop through the checkboxes
		if($("input:eq("+i+")").prop("checked"))
		{ // execute if the checkbox is checked
			if(ql[qid].correct.indexOf(i)>=0)
			{ // execute if the checkbox corresponds to a correct answer
				subMark+=0.25;
				sol+="<span class=\"passmark\">You selected &#8216;"+ql[qid].answers[i]+"&#8217;; this is correct.</span><br/>";
			} else { // an incorrect checkbox was selected
				sol+="<span class=\"failmark\">You selected &#8216;"+ql[qid].answers[i]+"&#8217;; this is incorrect.</span><br/>";
			} // end if statement
		} else if(ql[qid].correct.indexOf(i)>=0) { // execute if a correct checkbox was not selected
			sol+="<span class=\"failmark\">You did not select &#8216;"+ql[qid].answers[i]+"&#8217;; this is incorrect.</span><br/>";
		} else { // execute if an incorrect checkbox was not selected
			subMark+=0.25;
			sol+="<span class=\"passmark\">You did not select &#8216;"+ql[qid].answers[i]+"&#8217;; this is correct.</span><br/>";
		} // end if statement
	} // end for loop
	$("main>div").empty();
	if(subMark==0)
	{ // the user selected the incorrect answers and left the correct answers unselected
		$("main>div").append($("<p></p>").text("Sorry, you selected the incorrect answers.").attr("class","failmark"));
	} else if(subMark==1) { // the user selected all the correct answers and left all the incorrect answers unselected
		$("main>div").append($("<p></p>").text("Congratulations! You selected the correct answers.").attr("class","passmark"));
	} else { // the user selected some of the correct responses but not all
		$("main>div").append($("<p></p>").text("The answers you selected are partially correct.").attr("class","yellow"));
	} // end if statement
	$("main>div").append($("<p></p>").html(sol));
	mark+=subMark;
} // end validateCheck function

function closeMessage()
{
	return "If you leave now, your progress will be lost.";
} // end closeMessage function

function completeQuiz()
{
	question=21;
	$("body").attr("onbeforeunload",""); // remove confirmation box which displays if the user tries to leave the page while the quiz is in progress
	if($("header span").attr("class")=="dangermark")
	{ // show a pass mark if the user scores over 60%
		$("header span").attr("class","passmark");
} // end if statement
	$("main").empty();
	if(mark>=12)
	{ // execute if the quiz was passed
		$("main").append($("<p></p>").html("Congratulations! You passed the quiz! You scored <span class=\"passmark\">"+Math.floor((mark/20)*100)+"%</span>."));
		if(mark<20) { // execute if the mark was less than 100%
			$("main").append($("<p></p>").html("Can you improve upon that score? Why not find out by <a href=\"quiz.html\">retaking the quiz</a>."));
		} else { // execute if the mark was 100%
			$("main").append($("<p></p>").html("Can you repeat the feat? Why not find out by <a href=\"quiz.html\">retaking the quiz</a>."));
		} // end if statement
	} else { // execute if the quiz was failed
		$("main").append($("<p></p>").html("Sorry, you didn't pass the quiz. You scored <span class=\"failmark\">"+Math.floor((mark/20)*100)+"%</span>."));
		$("main").append($("<p></p>").html("Maybe you'll have better luck next time? Why not find out by <a href=\"quiz.html\">retaking the quiz</a>."));
	} // end if statement
} // end completeQuiz function