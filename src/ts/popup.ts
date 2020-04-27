const DOM: {
    form: HTMLFormElement,
    textarea: HTMLInputElement, 
    message: HTMLElement, 
    messageContent: HTMLElement
} = {
    form: document.querySelector('form'),
    textarea: document.querySelector('form > textarea'),
    message: document.querySelector('.message'),
    messageContent: document.querySelector('.message > p')
}

const emailRegex = /(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/;


const sanitizeValues = (array: string[]): string[] => {
    return [... new Set(
        array
            .filter(url => emailRegex.test(url))
            .map(url => url.trim())
    )];
}

const textToArray = (string: string): string[] => {
    let linebreaks: string[] = [
        '\n',
        '\r\n'
    ];

    for (let i = 0; i < linebreaks.length; i++) {
        if (RegExp(linebreaks[i]).test(string)) {
            return sanitizeValues(string.split(linebreaks[i]))
                
        }
    }

    return sanitizeValues([string]);
}

const onFormSubmit = (event: any) => {
    event.preventDefault();
    let value = textToArray(DOM.textarea.value);

    chrome.storage.sync.set({ storageBlacklist: value }, () => {
        console.log("saved: ", value);
        
        DOM.message.style.display = "flex";
        setTimeout((): void => {
            DOM.message.style.opacity = "1";
            DOM.messageContent.style.transform = "translateY(-7px)";

            setTimeout((): void => {
                window.close();
            }, 1200);
        }, 30);
    });
}

chrome.storage.sync.get(['storageBlacklist'], ({ storageBlacklist }) => {
    if (Array.isArray(storageBlacklist) && storageBlacklist.length > 0) {
        DOM.textarea.value = storageBlacklist.join('\n');
    }
});

DOM.form.addEventListener('submit', onFormSubmit);