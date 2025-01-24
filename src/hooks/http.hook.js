import { useState, useCallback } from "react";

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // делаем зарос и помещаем в request
    // здесь передаем аргументы как для пост-запроса, чтобы уметь делать универсальные запросы
    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-type': 'application/json'}) => {
        
        setError(null);
        setLoading(true);  // сначала загрузку в true

        // этот метод будет только отправлять запрос и не будет его обрабатывать при помощи then/catch, поэтому чтобы была возможность выдавать ошибку используем try/catch
        try {
            const response = await fetch(url, {method, body, headers}); // получаем ответ сервера в response

            // проверяем ответ, если он не ОК то выбрасываем ошибку для блока catch
            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            // .json() считывает тело ответа сервера в формате JSON и возвращает его в виде JavaScript-объекта
            const data = await response.json(); // в дату помещаем js объект преобразовыннй из JSON-ответа сервера, await ждет завершения обработки

            setLoading(false);  // загрузка завершена
            return data;        // возвращаем данные из метода request

        } catch(e) {
            setLoading(false);    // в любом случае если произошла ошибка то загрузка завершена
            setError(e.message);  // св-во объекта ошибки, выдает сообщение об ошибке (более продвинутый функционал чем просто true/false)
            throw e;              // из catch выкидываем ошибку
        }

    }, [])

    const clearError = useCallback(() => setError(null), []);  // функция по очистке ошибок (наглядны пример был в рандомЧар)

    return {loading, error, request, clearError};  // возвращаем из хука объект с его функционалом дл универсального использования где угодно
}        // этот хук позволяет нам отправлять любые запросы, обрабатывать результаты и сохранять локальное состояние.

// далее стоит задача связать этот универсальный хук с нашим уже готовым марвелСервисом, который отправляет запросы на опред. адреса и трансформирует данные
// превратим марвелСервис в хук, который будет использовать внутри себя готовый функционал нашего useHttp, но при этом оставим его в 
// папке сервисов и не будем менять название, т.к. это уже не базовая универсальная операция, а специализированная, которая настроена 
// на работу с конкретным API (marvelAPI).