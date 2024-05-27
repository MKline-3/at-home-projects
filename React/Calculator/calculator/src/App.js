import './App.css';
import { useReducer } from 'react';
import DigitButton from './DigitButtons'
import OperationButton from './OperationButton';

export const Actions = {
  ADD_DIGIT: 'add_DIGIT',
  OPERATION: 'operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}){
  switch(type) {
    case Actions.ADD_DIGIT:
      if(state.overwrite){
        return {
          ... state,
          curOperand: payload.digit,
          overwrite: false,
        }
      }
      // Handle edge case of no buttons pushed
      if (payload.digit === "0" && state.curOperand === "0"){
           return state
        }
      // Prevent user from entering multiple decimals
      if (payload.digit === "." && state.curOperand.includes(".")){
          return state
        }
      if(state.curOperand == null){
        return {
          ... state,
          curOperand: payload.digit
        }
      }
      return {
        ... state,
        curOperand: state.curOperand + payload.digit
      }
    case Actions.OPERATION:
      // Don't add operation if values aren't entered
      if (state.curOperand == null && state.prevOperand == null){ return {}}
      if (state.curOperand == null){
        return{
          ... state,
          operation: payload.operation,
        }
      }
      if (state.prevOperand == null){
        return {
          ... state,
          operation: payload.operation,
          prevOperand: state.curOperand,
          curOperand: null
        }
      }

      return {
        ... state,
        prevOperand: evaluate(state),
        operation: payload.operation,
        curOperand: null
      }
    case Actions.CLEAR:
      return {}
    case Actions.DELETE_DIGIT:
      if(state.overwrite){
        return {
          ... state,
          overwrite: false,
          curOperand: null
        }
      }
      // Handle edge case of no value or value of 1 digit
      if(state.curOperand == null){return state}
      if(state.curOperand.length === 1){
        return {... state, curOperand: null}
      }
      return {
        ... state,
        curOperand: state.curOperand.slice(0, -1)
      }

    case Actions.EVALUATE:
      // Only evaluate if we have all items
      if(state.operation == null || state.curOperand == null || state.prevOperand == null){
        return state
      }

      return {
        ...state,
        overwrite: true,
        prevOperand: null,
        operation: null,
        curOperand: evaluate(state)
      }
  }
}

function evaluate({curOperand, prevOperand, operation}){
  const prev = parseFloat(prevOperand)
  const cur = parseFloat(curOperand)
  if(isNaN(prev) || isNaN(cur)){ return "" }
  let result = ""

  switch (operation) {
    case "+":
      result = prev + cur
      break
    case "-":
      result = prev - cur
      break
    case "/":
      result = prev / cur
      break
    case "*":
      result = prev * cur
      break
  }
  return result.toString()
}

function App() {
  const [{curOperand, prevOperand, operation}, dispatch] = useReducer(reducer, {})
  return (
    <div className='calculator-grid'>
      <div className='output'>
        <div className='prev-operand'>{prevOperand} {operation}</div>
        <div className='cur-operand'>{curOperand}</div>
      </div>
      <button className='span-two' onClick={() => dispatch({type: Actions.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: Actions.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className='span-two' onClick={() => dispatch({type: Actions.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
