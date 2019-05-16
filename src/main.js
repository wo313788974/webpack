import $ from 'jquery'

import './css/index.css'
import './css/index.less'
import './css/index.scss'

$(function(){
  $('li:odd').css('color','red');
  $('li:even').css('color','orange');
})

class Person {
  static info = {name: 'fy'}
}
const p = new Person();
console.log(Person.info)