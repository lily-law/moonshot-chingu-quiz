/*
  This page will load at the url "/quiz/:slug"
*/

import React, { useState, useEffect } from "react";
// import useSWR from 'swr';// <-- uncomment when DB is ready
import { useRouter } from "next/router";
// import apiRoutes from '../../api-routes';// <-- uncomment when DB is ready
import { dummyData } from "../dummy-quiz-data";
// import DisplayMessage from '../../components/shared/DisplayMessage';
import {
  QuizHeader,
  AnswersTileSection,
  NextQuestionBtnContainer,
  AnswerTileContainerLink,
} from "../../components/quizSingle/styles";
import { PageHeader } from "../../components/shared/styles";
import Header from "../../components/header/Header";
import QuestionHeader from "../../components/quizSingle/QuestionHeader";
import AnswerTileContainer from "../../components/quizSingle/AnswerTileContainer";
import NextQuestionBtn from "../../components/quizSingle/NextQuestionBtn";
import { ContentWrapper } from "../../components/footer/styles";

export default function Quiz() {
  const router = useRouter();

  // const fetcher = url => fetch(url).then(res => res.json());
  // const {data, error} = useSWR(apiRoutes.getAllQuizzes, fetcher);
  const [allSubjectQuizzes, setAllSubjectQuizzes] = useState([]);
  const [chosenQuiz, setChosenQuiz] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [allQuestionsCount, setAllQuestionsCount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [currentQuestionAnswers, setCurrentQuestionAnswers] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // When id is selected and quizzes are loaded,
  // find quiz by id and save it to state
  useEffect(() => {
    if (router.query.slug) {
      const filtered = allSubjectQuizzes.filter(quiz => {
        return String(quiz.id) === String(router.query.slug);
      });
      const filteredQuiz = filtered.length ? filtered[0] : {};
      setChosenQuiz(filteredQuiz);
    }
  }, [router.query.slug, allSubjectQuizzes]);

  // ** Uncomment when DB is ready
  // Set data returned from SWR in state
  // useEffect(() => {
  //   if (data) {
  //     setAllSubjectQuizzes(data);
  //   }
  // }, [data]);

  // Set Dummy Data into state until DB is ready
  useEffect(() => {
    if (dummyData) {
      setAllSubjectQuizzes(dummyData);
    }
  }, [dummyData]);

  // Set current quiz question to state
  useEffect(() => {
    if (chosenQuiz && chosenQuiz.questions && chosenQuiz.questions.length) {
      setCurrentQuestion(chosenQuiz.questions[currentQuestionIndex]);
      setAllQuestionsCount(chosenQuiz.questions.length);
    }
  }, [chosenQuiz, currentQuestionIndex]);

  // Set current question answers to state
  useEffect(() => {
    if (currentQuestion) {
      setCurrentQuestionAnswers(currentQuestion.answers);
    }
  }, [currentQuestion]);

  const toggleSelectedAnswer = i => {
    let node = i.target;
    while (node.classList.toString().indexOf("Container") < 0) {
      node = node.parentNode;
    }
    const clickedAnswerMark = node.firstChild.innerText;
    let clickedAnswer = null;
    currentQuestionAnswers.forEach((answer, index) => {
      const mark = String.fromCharCode("A".charCodeAt(0) + index);
      if (mark === clickedAnswerMark) clickedAnswer = answer;
    });

    const selectedAnswersTmp = JSON.parse(JSON.stringify(selectedAnswers));
    if (!selectedAnswersTmp[currentQuestionIndex])
      selectedAnswersTmp[currentQuestionIndex] = [clickedAnswer.id];
    else if (
      selectedAnswersTmp[currentQuestionIndex].find(
        id => id === clickedAnswer.id
      )
    )
      selectedAnswersTmp[currentQuestionIndex].splice(
        selectedAnswersTmp[currentQuestionIndex].indexOf(clickedAnswer.id),
        1
      );
    else selectedAnswersTmp[currentQuestionIndex].push(clickedAnswer.id);

    setSelectedAnswers(selectedAnswersTmp);
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  return (
    <>
      <QuizHeader>
        <PageHeader>{chosenQuiz.title}</PageHeader>
      </QuizHeader>
      {/* {
        !!error && (<DisplayMessage message="Error loading quiz" />)
      }
      {
        !error && !data && (<DisplayMessage message="... Loading Quiz" />)
      } */}
      {chosenQuiz && currentQuestion && currentQuestionAnswers && (
        <span>
          <QuestionHeader
            questionData={currentQuestion}
            questionIndex={currentQuestionIndex + 1}
            questionCount={allQuestionsCount}
            animationDelay={30}
          />

          <AnswersTileSection>
            {currentQuestionAnswers.map((answer, i) => (
              <AnswerTileContainerLink onClick={toggleSelectedAnswer}>
                <AnswerTileContainer
                  mark={String.fromCharCode("A".charCodeAt(0) + i)}
                  answerData={answer}
                  selected={Object.values(selectedAnswers).some(v => {
                    return v.find(id => id === answer.id);
                  })}
                />
              </AnswerTileContainerLink>
            ))}
          </AnswersTileSection>
          {currentQuestionIndex < allQuestionsCount - 1 && (
            <ContentWrapper>
              <NextQuestionBtnContainer>
                <a
                  tabIndex={0}
                  role="link"
                  onClick={nextQuestion}
                  onKeyDown={nextQuestion}
                >
                  <NextQuestionBtn />
                </a>
              </NextQuestionBtnContainer>
            </ContentWrapper>
          )}
        </span>
      )}
    </>
  );
}

// Tells NextJS this page should use the Header setup in '_app'
Quiz.Header = Header;
