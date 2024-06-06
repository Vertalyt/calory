
<template>
    <div class="flex gap-5 my-2">
      <h3 class="font-bold">Week</h3>
      <label class="checkbox style-e">
                <input
                v-model="isWeek"
                 type="checkbox"/>
                <div class="checkbox__checkmark"></div>
      </label>
      <h3 class="font-bold">7 day</h3>
    </div>
</template>


<script setup>
import { isWeek } from '../../constants'

</script>


<style scoped>

.checkbox.style-e {
  display: inline-block;
  position: relative;
  padding-left: 50px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.checkbox.style-e input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.checkbox.style-e input:checked ~ .checkbox__checkmark {
  background-color: #f7cb15;
}
.checkbox.style-e input:checked ~ .checkbox__checkmark:after {
  left: 21px;
}
.checkbox.style-e:hover input ~ .checkbox__checkmark {
  background-color: #f7cb15;
}
.checkbox.style-e:hover input:checked ~ .checkbox__checkmark {
  background-color: #f7cb15;
}
.checkbox.style-e .checkbox__checkmark {
  position: absolute;
  top: 1px;
  left: 0;
  height: 22px;
  width: 40px;
  background-color: #f7cb15;
  transition: background-color 0.25s ease;
  border-radius: 11px;
}
.checkbox.style-e .checkbox__checkmark:after {
  content: "";
  position: absolute;
  left: 3px;
  top: 3px;
  width: 16px;
  height: 16px;
  display: block;
  background-color: #fff;
  border-radius: 50%;
  transition: left 0.25s ease;
}
.checkbox.style-e .checkbox__body {
  color: #333;
  line-height: 1.4;
  font-size: 16px;
  transition: color 0.25s ease;
}

</style>