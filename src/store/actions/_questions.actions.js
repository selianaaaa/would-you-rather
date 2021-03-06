import { usersActions } from '../actions';
import { questionsConstants } from '../../constants';
import { _getQuestions, _saveQuestionAnswer, _saveQuestion } from '../../utils';

/**
 * Setting questions request condition
 * @param {boolean} inRequest - request condition
 */
const setQuestionsRequest = (inRequest) => ({
  type: questionsConstants.SET_QUESTIONS_REQUSET,
  payload: inRequest,
});

/**
 * Setting questions
 * @param {Array} questions - questions
 */
export const setQuestions = (questions) => {
  return (dispatch) => {
    dispatch({
      type: questionsConstants.SET_QUESTIONS,
      payload: questions,
    });
  };
};

/**
 * Request questions
 */
export const getQuestions = () => {
  return async (dispatch) => {
    dispatch(setQuestionsRequest(true));

    try {
      const questions = await _getQuestions();
      dispatch(setQuestions(questions));
    } catch (error) {
      console.log(error);
    }

    dispatch(setQuestionsRequest(false));
  };
};

/**
 * Save answer to the question
 */
export const saveQuestionAnswer = (questionId, answerOption, userId) => {
  return async (dispatch, getState) => {
    const { questions } = getState().questions;

    const newQuestions = questions.slice();

    const question = newQuestions.find(
      (question) => question.id === questionId
    );

    if (question) {
      question[answerOption].votes.push(userId);
    }

    dispatch(setQuestions(newQuestions));

    return _saveQuestionAnswer({
      authedUser: userId,
      qId: questionId,
      answer: answerOption,
    }).catch((e) => {
      console.warn('Error in handleSaveQuestionAnswer:', e);
    });
  };
};

/**
 * Adding questions request condition
 * @param {boolean} inRequest - request condition
 */
const setAddingQuestion = (inRequest) => ({
  type: questionsConstants.SET_ADDING_QUESTION,
  payload: inRequest,
});

/**
 * Add new question
 */
export const addQuestion = (options, userId, history) => {
  return async (dispatch, getState) => {
    const { questions } = getState().questions;

    dispatch(setAddingQuestion(true));

    try {
      const question = await _saveQuestion({
        optionOne: options.optionOne,
        optionTwo: options.optionTwo,
        author: userId,
      });

      const newQuestions = questions.slice();
      newQuestions.push(question);

      dispatch(setQuestions(newQuestions));
      dispatch(usersActions.saveUserQuestion(question.id));

      history.push('/');
    } catch (error) {
      console.log(error);
    }

    dispatch(setAddingQuestion(false));
  };
};
