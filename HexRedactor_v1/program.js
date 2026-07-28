//////////////////////////////// Глобальные переменные ////////////////////////////////
var dannArray=[]; // Файл по байтам в 16-ричной системе
var nameFile=""; // Имя открытого файла (с расширением)
var sizeFile=""; // Размер открытого файла
var typeFile=""; // Тип открытого файла

//////////////////////////////// Генерация элементов ////////////////////////////////
function createHexRedactorLine(lengthLine,number){ //сгенерировать линию для 16-ричного редактора с lengthLine байтами
   const panel=document.createElement('div'); // Создать новый див элемент куда будут помещаться остальные элементы
   panel.className="horizontal"; // Установить имя класса
   const pRight=document.createElement('div'); // Создать новый див элемент куда будет помещаться информация в виде текста (правая панель)
   pRight.className="TextDann"; // Установить имя класса
   const pCenter=document.createElement('div'); // Создать новый див элемент куда будет помещаться информация в виде 16-ричного кода (средняя панель)
   pCenter.className="HexDann"; // Установить имя класса
   const pLeft=document.createElement('div'); // Создать новый див элемент где будет написана позиция элемента (левая панель)
   pLeft.className="Number"; // Установить имя класса
   pLeft.innerHTML = (number*16).toString().padStart(8, '0'); // В левую панель написать позицию элемента с учётом 8 символов

   const inputText=document.createElement('input');  // Создаем поле для отображения текста целиком
   inputText.disabled = true; // Запрещаем редактировать данное поле, так как его редактирование может привести к искажению при переводе на 16-ричную систему
   inputText.className="inputDannText"; // Установить имя класса
   inputText.setAttribute("numstart", number*16 ); // Установить атрибут, отвечающий за начальную позицию этого элемента
   inputText.setAttribute("numend", number*16+lengthLine.length ); // Установить атрибут, отвечающий за конечную позицию этого элемента
   pRight.appendChild(inputText); // Добавляем созданное поле на правую панель

   // В зависимости от размера массива создаем поля для ввода данных в 16-ричном формате
   if(lengthLine.length <= 16){
      for(let i = 0; i < lengthLine.length; i++){
         const input = document.createElement('input'); // Создаем поле для отображения 1 байта в 16-ричном формате (от 00 до FF)
         input.className="inputDann"; // Установить имя класса
         input.setAttribute('num', i+(number*16) ); // Установить атрибут, отвечающий за точную позицию этого элемента (порядковый номер)
         input.gotoInputText = inputText; // Передать переменную отвечающую за поле для отображения текста целиком
         input.addEventListener('keypress', isHexInputDann); // Добавить слушатель, срабатывающий при нажатии клавиши
         input.addEventListener('input', isHexInputDannReplase); // Добавить слушатель, срабатывающий при любом изменении значения поля
         input.value = dannArray[i+(number*16)].toUpperCase(); // Добавить текст из загруженного файла 
         pCenter.appendChild(input); // Добавляем созданное поле на среднюю панель 
      }
      updateInputTextElement(inputText); // Вызываем функцию для обновления поля в правой панели
   }
   panel.appendChild(pLeft); // Добавляем левую панель в главный "div" элемент
   panel.appendChild(pCenter); // Добавляем среднюю панель в главный "div" элемент
   panel.appendChild(pRight); // Добавляем правую панель в главный "div" элемент
   return panel; // Возвращаем главный "div" элемент
}

function updateInputTextElement(element){
   hexArray = dannArray.slice(element.getAttribute("numstart"),element.getAttribute("numend")); //берем часть массива dannArray согласно атрибутам начальной и конечной позиции
   const byteArray = []; // Создаем пустой массив в который будем записывать коды символов
   let decimalValue; // создаем переменную, хранящую общий код символа (1 или 2 байта)
   for (let i = 0; i < hexArray.length; i++) {
      decimalValue = parseInt(hexArray[i], 16); //Преобразование из 16-ричной системы в 10-ричную
      byteArray.push(decimalValue); //добавляем новый элемент в массив
   }
   // Создаём Uint8Array и декодируем как UTF‑8
   const uint8Array = new Uint8Array(byteArray); 
   const decoder = new TextDecoder('utf-8');
   const resultText = decoder.decode(uint8Array);

   element.value = resultText; // Записываем полученный текст на экран пользователя
}

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
   console.log('текст:', text); // Выводим результат в консоль в виде текста
   console.log('Шестнадцатеричное представление:', dannArray); // Выводим результат в консоль в виде Hex текста

   document.getElementById("outputDann").textContent =""; // отчищаем поле в которое будем добавлять элементы на сайт

   /*Если осталось больше или равно 16 символов то добавить на экран строку с 16 символами, иначе добавить на экран строку с оставшимися символами */ 
   let position = dannArray.length;
   for(let i = 0; i < (dannArray.length/16); i++){
      if(position / 16 >= 1){
         document.getElementById("outputDann").appendChild(createHexRedactorLine(dannArray.slice(i, i+16),i)); 
      }
      else{
         document.getElementById("outputDann").appendChild(createHexRedactorLine(dannArray.slice( i, i+(position % 16) ),i));
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

function writeToFile() { //Сохранение в файл бинарного кода из глобальной переменной dannArray
   const byteArray = []; // Создаем пустой массив
   let decimalValue; // создаем переменную, хранящую общий код символа (1 или 2 байта)
   for (let i = 0; i < dannArray.length; i++) {
      decimalValue = parseInt(dannArray[i], 16); // Преобразование из 16-ричной системы в 10-ричную
      byteArray.push(decimalValue); //добавляем новый элемент в массив
   }
   const uint8Array = new Uint8Array(byteArray); // Создаём Uint8Array и декодируем как UTF‑8

   const blob = new Blob([uint8Array], { type: typeFile }); // Создаём Blob с массивом uint8Array и указанным типом
   const url = URL.createObjectURL(blob); // Создаём URL для этого Blob
   const a = document.createElement('a'); // Создаём элемент <a> для запуска скачивания
   a.href = url;
   a.download = nameFile ; // Указываем имя файла
   document.body.appendChild(a); // Добавляем ссылку в DOM
   a.click(); // имитируем клик 
   document.body.removeChild(a); // Удаляем ссылку в DOM
   URL.revokeObjectURL(url); // Удаляем URL для этого Blob
}

const input = document.getElementById("myFile");                          // получаем ссылку на элемент с файлом
input.addEventListener('change', loadFile);                               // добавляем слушатель на загрузку файла и вызываем функцию loadFile
//input.addEventListener('change', function(event) {loadFile(event);});   // добавляем слушатель на загрузку файла и вызываем функцию loadFile (2 рабочий способ)
const buttonSawe = document.getElementById("save");                       // получаем ссылку на элемент с кнопкой
buttonSawe.addEventListener('click', writeToFile);                        // добавляем слушатель на сохранение файла и вызываем функцию writeToFile
