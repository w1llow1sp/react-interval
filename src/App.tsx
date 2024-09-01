import React, { useState, useEffect } from 'react';
import {Input, Button, Space, Typography, notification} from 'antd';

const { Title } = Typography;

const CountdownTimer: React.FC = () => {
    const [seconds, setSeconds] = useState<number>(0); // оставшееся время в секундах
    const [inputValue, setInputValue] = useState<string>(''); // значение поля ввода
    const [isRunning, setIsRunning] = useState<boolean>(false); // состояние таймера (запущен/остановлен)
    const [timerId, setTimerId] = useState<number | null>(null); // идентификатор интервала

    // Обработчик для изменения поля ввода
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputValue(e.target.value);
    };

    // Обработчик для установки времени
    const handleSetTime = (): void => {
        const time = parseInt(inputValue, 10);
        if (!isNaN(time) && time > 0) {
            setSeconds(time);
        }
    };

    // Обработчик для запуска таймера
    const handleStart = (): void => {
        if (seconds > 0 && !isRunning) {
            setIsRunning(true);
        }
    };

    // Обработчик для паузы таймера
    const handlePause = (): void => {
        setIsRunning(false);
    };

    // Обработчик для сброса таймера
    const handleReset = (): void => {
        setIsRunning(false);
        setSeconds(0);
        setInputValue('');
        if (timerId) {
            clearInterval(timerId);
            setTimerId(null);
        }
    };

    // Функция для отображения уведомления
    const openNotification = () => {
        notification.info({
            message: 'Таймер завершен',
            description: 'Обратный отсчет завершен!',
            placement: 'topRight',
        });
    };

    // useEffect для обновления таймера каждую секунду
    useEffect(() => {
        if (isRunning) {
            const id = setInterval(() => {
                setSeconds((prevSeconds) => {
                    if (prevSeconds > 0) {
                        return prevSeconds - 1;
                    } else {
                        clearInterval(id);
                        setIsRunning(false);
                        openNotification(); // Показ уведомления при завершении таймера
                        return 0;
                    }
                });
            }, 1000);

            setTimerId(id);

            // Очистка интервала при размонтировании компонента или при изменении состояния
            return () => clearInterval(id);
        }
    }, [isRunning]);

    return (
        <div style={{padding: '20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center'}}>
            <Title level={2}>Таймер обратного отсчета</Title>
            <Space direction="vertical" size="middle">
                <Input
                    type="number"
                    placeholder="Введите время в секундах"
                    value={inputValue}
                    onChange={handleInputChange}
                    onPressEnter={handleSetTime}
                />
                <Button type="primary" onClick={handleSetTime}>
                    Установить время
                </Button>
                <Title level={3}>{seconds} секунд</Title>
                <Space>
                    <Button type="primary" onClick={handleStart} disabled={isRunning || seconds === 0}>
                        Старт
                    </Button>
                    <Button onClick={handlePause} disabled={!isRunning}>
                        Пауза
                    </Button>
                    <Button onClick={handleReset}>
                        Сброс
                    </Button>
                </Space>
            </Space>
        </div>
    );
};

export default CountdownTimer;

