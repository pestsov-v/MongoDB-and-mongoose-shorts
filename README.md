# Выжимка по работе с MongoDB 

Поскольку книга по MongoDB занимает порядка 500 страниц, а гуглить избитые вопросы глупо, мною было принято решение сделать небольшую шпаргалку по MongoDB, пока все эти нюансы не залезут в голову за годы оттачивания рук. Нюансы будут дополнятся в ходе столкновения проблемами или особенностями данной NoSQL базы данных.

## Оглавление
- [Когда не стоит использовать MongoDB](#когда-не-стоит-использовать-mongoDB)
- [Типы данных в MongoDB и операторы сравнения](#типы-данных-в-mongoDB-и-операторы-сравнения)
- [Запросы с Find](#запросы-с-find)
- [Операторы запроса](#операторы-запроса)
- [Запросы для определённых типов данных](#запросы-для-определённых-типов-данных)
- [Лимитирование, пропуск данных, сравнение и сортировка](#лимитирование-пропуск-данных-сравнение-и-сортировка)
- [Аккумуляторы](#аккумуляторы)
- [Агрегации](#агрегации)
- [Индексы](#индексы)
- [Нормализация и денормализация](#нормализация-и-денормализация)
- [Populate](#populate)

## Когда не стоит использовать MongoDB

Тогда, когда нам нужно использовать реляционные базы данных...и тем самым создать Холивар...На самом деле не стоит использовать если: <br/>
- Данные, которые необходимо вбивать являются систематическими с одним уровнем вложенности, проще говоря если база данных состоит из описания сущности электротехники, которая имеет конкретные данные по типу: вес, размер, номер модели, серии, год выпуска и т.д., тогда это проще как и хранить, так и обрабатывать в форме таблички. <br/>
MongoDB лучше подходит для сложных сущностей, которые имеют несколько уровней вложенности. Такими сущностями могут быть туры в магазине туризма. Тур будет иметь как простые данные (string, number или boolean) такие как название, сложность или продолжительность, так и сложные данные, такие как перечисление гидов, перечисление участников или же координаты рассположения тех или иных остановок по пути самого тура (подобные данные будут массивами с потенциальной вложенностью, так и объекты, поскольку координаты расположения это ширина и долгота). <br/>
- Команда разработчиков уже имеет свой стэк разработки и поэтому MongoDB может не вписаться. <br/>
- Объединение разных типов данных в разных измерениях - это то, что делает реляционные базыд анных фантастическими. MongoDB ре должна делать это хорошо и скорее всего никогда не будет. <br/>
- Использование инструментов, которые её не поддерживают (на момент описания этого README не поддерживаются такие инструметны как SQLAlchemy). <br/>

## Типы данных в MongoDB и операторы сравнения

**Типы данных в MongoDB:**

| Тип данных | Форма записи в запросах | Форма записи в моделях | Примеччание |
| :--------: | :--------------------- | :------------------- | :------- |
|   string   | User.find({nickname: "Avesels"}) | nickname: string | Условие должно быть в двойных кавычках
| number     | User.find({age: 25}) | age: number | Условие должно быть цифрой
| boolean    | User.find({isActive: true}) | isActive: true | Условие должно быть или true или false |
| array      | User.find({car: car}) | car: [string] <br/> holiday: [number] | В квадратных скобках указан любой из простых типов |
| date       | User.find({date: Date.now()}) | date: Date.now() | Как и формулы так и записи конкретных дат |
| ObjectId   | User.find({_id: mongoose.ObjectId}) | UserId: mongoose.Types.ObjectId | Уникальный тип, который должен быть записан через Types |
| Maps       | User.create({location: {latitude: 50.2, longitude: 50.2}}) | location: { type: Map, of: Number} | Объект, в котором заполнется как и тип самого Map так и из чего он состоит |

**Условные операторы сравнения:**

| Оператор сравнения | Условный оператор | Пояснение |
| :----------------: | :---------------: | :-------- |
| = | $eq | Равно |
| > | $gt | Строго больше |
| >= | $gte | Больше равно |
| < | $lt | Строго меньше |
| <= | $lte | Меньше равно |

## Запросы c Find
Find это аналог SELECT в SQL базах данных. <br/> <br/>

| Ключевое слово | Описание | Детали | Пример использования | Пояснение примера |
| :------------- | :------- | :----- | :------------------- | :---------------- |
| Find | Выполняет запрос выборки | Если не передавать никакого аргумента, то результатом запроса будут все документы из коллекции | Product.find() <br/> Product.find({}) | Предоставить из коллекции Product все документы |
| Find c парами ключ/значение | Выполняет запрос выборки с определенными параметрами | Результатом выборки будут все документы, где есть указанные пары ключ/значение. <br/> <br/> При передачи примитивов, MongoDB, автоматически их правильно считывает | Product.find({"price": 10}) <br/> Product.find({"product_category": "phone"}) <br/> Product.find({"isHave": true}) | Получить все документы из коллекции Product, где ключ price равняется значению 10 |
| Find возвращающий документы с затребоваными ключами | Возвращает результат выборки только с перечисляемыми ключами | Результом выборки будут часть каждого из документа, где есть перечисляемые пары ключ/значение | Product.find({}, {"price": 10, "amount" > 10}) | Возвращает из коллекции Product, только те документы, где есть пары ключ/значения "price": 10 и  "amount" > 10 и возвращает только эти пары ключ/значения из этих документов | 
| Find с условными операторами | Возвращает результат выборки проходящий условия условных операторов | Результатом выборки будет массив документов из коллекции, значения ключей, которые проходят условия | Product.find({"price": {$gte: 20, $lte: 60}}) | Возвращает те документы, в которых цена находится между 20 и 60 | 

## Операторы запроса

Операторы запроса выполняют функцию фильтрования значений, по наличию или отсутствию параметров указанных в условии запроса. <br/> <br/>

| Оператор | Описание | Пример использования | Пояснение примера |
| :------: | :------- | :------------------- | :---------------- |
| $ne | Результирующий набор составляют все значения, кроме тех, которые имеют параметры указаннве в условии | User.find({“username”: {“$ne”: “avesels”}}) | Получить всех пользователей кроме пользователя «avesels” | 
| $in | Результирующий набор составляют только те значение, которые имеют параметры указанные в условии | Ticket.find({“ticket_number”: {“$in”: [735, 99, 123]}}) | Получить документы, где номера билетов составляют: 735, 99, 123 |
| $nin | Результирующий набор составляют все значения, кроме тех, которые подпадают под параметры указанные в условии | Ticket.find({“ticket_number”: {“$nin”: [735, 99, 123]}}) | Получить документы, где номера билетов НЕ составляют: 735, 99, 123 | 
| $or | Результирующий набор составляют все значение проходящие все условия | Ticket.find($or: [{“ticket_number”: {“$in”: [735, 99, 123]}}, “winner”: true) | Получить документы, где номера билетов составляют: 735, 99, 123 и поле winner равно true | 

## Запросы для определённых типов данных

Поскольку при выборке документов из коллекции, в результирующий набор попадает n-ое количество документов. Чтобы управлять этим n в рамках результируюющего выбора существуют операторы фильтрации этого массива документов. <br/> <br/>

### Операторы по фильтрации массива документов
| Оператор | Описание | Детали | Пример использования |
| :------: | :------- | :----  | :------------------- |
| $all     | Находит все документы с необходимыми элементами в массиве | Порядок описания не имеет значения, поскольку в выборку попадают все документы, в которых есть значения указанные в условии запроса | Tour.find({"tourName": {$all: ["the sky", "winelog"]}}) |
| $size | Ограничивает количество документов, которые будут получены в результирующем наборе | Возвращает массив документов ограниченой длины | Tor.find({"tour": {$size: 3}}) |
| $slice | Возвращает подмножество документов | Возвращает массив документов в ограниченном количестве. <br/> <br/> Если нужны документы с конца необходимо поставить "-" перед числом. <br/> <br/> Если нужны документы из средины массива документов - первым аргументов обозначается элемент с которого начать, вторым аругментом - количество документов | Post.find({"comments": {$slice: 3}}) <br/> <br/> Post.find({"comments": {$slice: -3}}) <br/> <br/> Post.find({"comments": {$slice: [3, 10]}}) |
| $ | Возвращает указанное количество любых документов из массива | Количество элементов указывается после оператора | Post.find({"comments.$": 2}) |
| $elemMatch | Группирует несколько условий выборки | Находит те документы, которые соответствуют всем условиям | Products.find({'freight": {$elemMatch: {$gte: 10, $lt: 20}}}) |

### Запросы для типов Null и регулярных выражений
| Тип | Оператор | Описание | Пример использования |
| :-: | :------: | :------- | :------------------- |
| Null | $exists | В MongoDB тип Null ещё значит, что данных не существует. Используется если нам нужны значения, где значение есть Null, но при этом это и есть искомое значение | User.find({"eq": Null, "$exists": true}) |
| Регулярные выражения | $regex | Если необходимо ввести регулярное выражение как условие запроса | User.find({"nickname": {"$regex": /aves/i}}) |


## Лимитирование, пропуск данных, сравнение и сортировка

Результирующий набор документов полученный из коллекции можно предать различным методам, если нам нужно ограничить количество документов в результирующем наборе, пропустить обозначенное количество документов, сравнить на соответствие с условием запроса или же отсортировать в нужном порядке. <br/>

### Методы обработки документов
| Метод | Описание | Пример использования | Пояснение примера |
| :---: | :------- | :------------------- | :---------------- |
| .limit() | Предоставляет ограниченное количество документов из коллекции | Product.find().limit(4) | Выдает 4 или меньше, первых продукта из коллекции Product |
| .skiр() | Пропускает ограниченное количество данных из массива коллекции | Product.find().skip(3) | Пропускает первые три документа из коллекции Product |
| .sort() | Сортирует документы по возрастанию или убыванию определенного ключа документа | Product.find().sort({"productName": 1}) <br/> <br/> Product.find().sort({"productName": 1, "price": -1}) | Отсортирует по возрастанию productName каждый из документов коллекции Product <br/> <br/> Отсортирует по возрастанию productName, после чего в каждом productName отсорирует по убыванию стоимости документы из коллекции Product |

### Порядок сравнения
В MongoDB существует иерархия относительно того, как типы сравниваются. Порой может быть один ключ с несколькими типами, например целые числа и логические типы данных или строки и нули. Если выполнять сортировку по ключу со смесью типов, существует предопределённый порядок, в котором они будут отсортированы. Вот как выглядит этот порядок от наименьшего значения к наибольшему: <br/>
1. Минимальное значение. <br/>
2. Ноль. <br/>
3. Числа (целые, длинные, двойные, десятичные). <br/>
4. Объект / документ.
5. Массив.
6. Двоичные данные.
7. Идентификатор объекта.
8. Логический тип данных.
9. Дата.
10. Временная отметка.
11. Регулярное выражение.
12. Максимальное значение. 

## Аккумуляторы

Аккумуляторы служат для того, чтобы вычилсять значения из нескольких документов и предоставлять результат в результирующий набор. Аккумуляторами монжо считать те операции, которые сканируют все документы. <br/> <br/>

| Аккумулятор | Описание | Пример использования | Пояснение примера |
| :---------: | :------- | :------------------- | :---------------- |
| $sum | Суммирует все значения определенного поля во всех документах коллекции | totalPrice: {$sum: "price"} | Получает суммарную итоговую стоимость |
| $avg | Находит среднее значение определенного поля во всех документах коллекции | totalPrice: {$avg: "price} | Получает среднюю стоимость |
| $first | Находит первый документ по значению определенного поля | product: {$first: "phone"} | Получает первый документ у которого есть ключ/значение product: phone |
| $last | Находит последний документ по значению определенного поля | product: {$last: "phone"} | Получает последний документ у которого есть ключ/значение product: phone |
| $min | Находит документ с минимальным значением определенного поля | minPrice: {$min: "price"} | Находит документ с наименшой ценой |
| $max | Находит документ с максимальным значением определенного поля | maxPrice: {$max: "price"} | Находит документ с наибольшей ценой |

## Агрегации

## Индексы

## Нормализация и денормализация

## Populate
