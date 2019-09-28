import React from 'react'
import { render } from 'react-dom';

//Import CSS
import "./css/style.css"

//Import Router
import Router from "./components/Router"

render(<Router />, document.querySelector('#main'))