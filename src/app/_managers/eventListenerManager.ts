interface LocalStorageChangeEventDetail<T> {
    key: string;
    value: T;
}

export const addLocalStorageListener = <T>(key: string, callback: (value: T) => void) => {
    const handleStorageChange = (event: CustomEvent<LocalStorageChangeEventDetail<T>>) => {
        if (event.detail.key === key) {
            callback(event.detail.value);
        }
    };

    window.addEventListener("localStorageChange", handleStorageChange as EventListener);

    return () => {
        window.removeEventListener("localStorageChange", handleStorageChange as EventListener);
    };
};
