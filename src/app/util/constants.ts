export const ROWS_IN_TABLE: number = 5;
export const AUTH_DATA = "auth_data";

export const roles = [
  {label: 'Студент', value: 'student'},
  {label: 'Викладач', value: 'teacher'},
];

export const cycles = [
  {label:'Бакалавр', value:'BACHELOR'},
  {label:'Магістр', value:'MASTER'},
  {label:'Доктор філософії', value:'DOCTORATE'}
];

export const programTypes = [
  {label:'Освітньо-наукова', value:'ON'},
  {label:'Освітньо-професійна', value:'OP'}
];

export const programForms = [
  {label:'очна денна', value:'intramural'},
  {label:'очна вечірня', value:'intramural_evening'},
  {label:'заочна', value:'extramural'},
  {label:'дистанційна', value:'remote'},
  {label:'мережева', value:'network'},
  {label:'дуальна', value:'dual'},
];

export const documentTypes = [
  {label:'Навчальний план за ОП', value:'CURRICULUM'},
  {label:'Освітня програма', value:'EDUCATION_PROGRAM'},
  {label:'Рецензії та відгуки роботодавців', value:'REVIEW'},
  {label:'Силабус', value:'SYLLABUS'},
];

export const componentTypes = [
  {label:'Навчальна дисципліна', value:'DISCIPLINE'},
  {label:'Практика', value:'PRACTICE'},
  {label:'Підсумкова атестація', value:'FINAL_CERTIFICATION'},
  {label:'Курсова робота (практика)', value:'COURSE_PROJECT'}
];
