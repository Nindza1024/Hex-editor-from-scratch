//////////////////////////////// Глобальные переменные ////////////////////////////////
var dannArray=[]; // Файл по байтам в 16-ричной системе
var nameFile=""; // Имя открытого файла (с расширением)
var sizeFile=""; // Размер открытого файла
var typeFile=""; // Тип открытого файла

//////////////////////////////// Генерация элементов ////////////////////////////////

//////////////////////////////// Работа с файлом и текстом в 16-ричной системе ////////////////////////////////
function readFile(dann){ //чтение файла
   dannArray=[]; // Отчищаем глобальную переменную
   const arrayBuffer = dann.result; // получаем  массив из функции loadFile
   const uint8Array = new Uint8Array(arrayBuffer); //Создаем массив 8-битных целых чисел без знака (то есть значений от 0 до 255)
   let hex,text='';
   for (let i = 0; i < uint8Array.length; i++) {
      hex = uint8Array[i].toString(16).padStart(2, '0'); // Преобразуем байт в шестнадцатеричное представление (2 символа)
      dannArray[dannArray.length]=hex; // Добавляем новый элемент в массив
   }
   text=new TextDecoder('utf-8').decode(uint8Array); //так можно получить текст из файла
   console.log('текст:', text); // Выводим результат вв консоль в виде текста
   console.log('Шестнадцатеричное представление:', dannArray); // Выводим результат вв консоль в виде Hex текста

   document.getElementById("outputDann").textContent =""; // отчищаем поле в которое будем добавлять элементы на сайт

   /*Если осталось больше или равно 16 символов то добавить на экран строку с 16 символами, иначе добавить на экран строку с оставшимеся символами */ 
   let position = dannArray.length;
   for(let i = 0; i < (dannArray.length/16); i++){
      if(position / 16 >= 1){
         //document.getElementById("outputDann").appendChild(createHexRedactorLine(dannArray.slice(i, i+16),i)); 
      }
      else{
         //document.getElementById("outputDann").appendChild(createHexRedactorLine(dannArray.slice( i, i+(position % 16) ),i));
      }
      position = position - 16;
   }

}

function loadFile(dann){ // Загрузка файла
   const file = dann.target.files[0]; //Получаем выбранный файл
   if(!file){
      console.log("not file");
      return; // выйти из функции если нет файла
   } 
   nameFile=file.name; // Получаем имя файла
   sizeFile=file.size; // Получаем размер файла
   typeFile=file.type; // Получаем тип файла
   
   const reader = new FileReader(); // Создаем экземпляр класса для чтения файла
   reader.readAsArrayBuffer(file); // Начинаем читать файл как массив
   reader.onload = function() {readFile(this)}; //Когда массив готов передаем его в функцию readFile
 
}

const input = document.getElementById("myFile");                          // получаем ссылку на элемент с файлом
input.addEventListener('change', loadFile);                               // добавляем слушатель на загрузку файла и вызываем функцию loadFile
//input.addEventListener('change', function(event) {loadFile(event);});   // добавляем слушатель на загрузку файла и вызываем функцию loadFile (2 рабочий способ)
