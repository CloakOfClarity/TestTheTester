var question = 0; var mark = 0; var qid = 0; var prevQuest = [];

function selectQuestion()
{
	qid = getRandomQuestion();
	question += 1;
	$("h2>span").text(question);
	$("main>p").html(getQuestionText(qid));
	$("main>div").empty();
	if(typeof ql[qid].correct=="number")
	{
		for (let i = 0; i < ql[qid].answers.length; i++)
		{
			addRadioButton(qid,i);
		}
	} else {
		for (let i = 0; i < ql[qid].answers.length; i++)
		{
			addCheckbox(qid,i);
		}
	}
}

function getRandomQuestion()
{
	var id;
	do
	{
		id = Math.floor(Math.random() * ql.length);
	} while(prevQuest.indexOf(id)>=0)
	prevQuest.push(id);
	return id;
}

function getQuestionText(id)
{
	return ql[id].question.replace(/\|/g,"<br>");
}

function addRadioButton(q,a)
{
	$("main>div").append($("<div></div>").attr("class","radio"));
	$("main>div>div:last").append($("<input/>").attr({"type":"radio","id":"answer"+a,"name":"answers","value":a,"class":"radio"}));
	$("main>div>div:last").append($("<label></label>").attr("for","answer"+a).text(ql[q].answers[a]));
}

function addCheckbox(q,a)
{
	$("main>div").append($("<div></div>").attr("class","form-check"));
	$("main>div>div:last").append($("<input/>").attr({"type":"checkbox","id":"answer"+a,"name":"answers","value":a,"class":"form-check-input"}));
	$("main>div>div:last").append($("<label></label>").attr({"for":"answer"+a,"class":"form-check-label"}).text(ql[q].answers[a]));
}

function checkResponse()
{
	if($("button").text()=="Submit Answer")
	{
		if($(":checked").length>0)
		{
			if (typeof ql[qid].correct == "number")
			{
				validateRadio($(":checked").val());
			} else {
				validateCheck()
			}
			$("p>span").text(Math.floor((mark / question) * 100));
			if(question<20)
			{
				$("button").text("Next Question");
			} else {
				$("button").text("View Results");
			}
		}
	} else {
		if(question<20)
		{
			$("button").text("Submit Answer");
			selectQuestion();
		} else {
			completeQuiz();
		}
	}
}

function validateRadio(sel)
{
	$("main>div").empty();
	$("main>div").append($("<p></p>").html("You selected &#8216;"+ql[qid].answers[sel]+"&#8217;."));
	if(sel==ql[qid].correct)
	{
		$("main>div").append($("<p></p>").text("Congratulations! You selected the correct answer."));
		mark += 1;
	} else {
		$("main>div").append($("<p></p>").html("Sorry, you selected the incorrect answer. The correct answer was &#8216;"+ql[qid].answers[ql[qid].correct]+"&#8217;."));
	}
}

function validateCheck()
{
	let sol = ""; let subMark = 0;
	for(let i=0;i<4;i++)
	{
		if($("input:eq("+i+")").prop("checked"))
		{
			if(ql[qid].correct.indexOf(i)>=0)
			{
				subMark+=0.25;
				sol+="You selected &#8216;"+ql[qid].answers[i]+"&#8217;; this is correct.<br/>";
			} else {
				sol+="You selected &#8216;"+ql[qid].answers[i]+"&#8217;; this is incorrect.<br/>";
			}
		} else if(ql[qid].correct.indexOf(i)>=0) {
			sol+="You did not select &#8216;"+ql[qid].answers[i]+"&#8217;; this is incorrect.<br/>";
		} else {
			subMark+=0.25;
			sol+="You did not select &#8216;"+ql[qid].answers[i]+"&#8217;; this is correct.<br/>";
		}
	}
	$("main>div").empty();
	if(subMark==0)
	{
		$("main>div").append($("<p></p>").text("Sorry, you selected the incorrect answers."));
	} else if(subMark==1) {
		$("main>div").append($("<p></p>").text("Congratulations! You selected the correct answers."));
	} else {
		$("main>div").append($("<p></p>").text("The answers you selected are partially correct."));
	}
	$("main>div").append($("<p></p>").html(sol));
	mark+=subMark;
}

function completeQuiz()
{
	question=21;
	$("main").empty();
	if(mark>=12)
	{
		$("main").append($("<p></p>").text("Congratulations! You passed the quiz! You scored "+Math.floor((mark/20)*100)+"%."));
		if(mark<20) {
			$("main").append($("<p></p>").html("Can you improve upon that score? Why not find out by <a href=\"quiz.html\">retaking the quiz</a>."));
		} else {
			$("main").append($("<p></p>").html("Can you repeat the feat? Why not find out by <a href=\"quiz.html\">retaking the quiz</a>."));
		}
	} else {
		$("main").append($("<p></p>").text("Sorry, you didn't pass the quiz. You scored "+Math.floor((mark/20)*100)+"%."));
		$("main").append($("<p></p>").html("Maybe you'll have better luck next time? Why not find out by <a href=\"quiz.html\">retaking the quiz</a>."));
	}
}