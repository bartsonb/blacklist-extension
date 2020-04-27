interface Blacklist {
    urls: string[],
    tabIds: any[]
}

let blacklist: Blacklist = {
    urls: [], 
    tabIds: []
}

const redirectionUrl = chrome.extension.getURL('html/blocked.html');

const isBlockedUrl = (url: string) => {
    return blacklist.urls.find(blockedUrl => urlToRegex(blockedUrl).test(url));
}

const isBlockedTabId = (id: number) => {
    return blacklist.tabIds.includes(id);
}

const clearTabId = (id: number) => {
    blacklist.tabIds.splice(blacklist.tabIds.indexOf(id), 1);
}

const urlToRegex = (url: string) => {
    return RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
}

const onTabUpdate = (tabId: number, changeInfo: any, tab: any): void => {
    if (isBlockedUrl(tab.url) && !isBlockedTabId(tabId)) {
        blacklist.tabIds.push(tabId);
        chrome.tabs.update(tabId, { url: redirectionUrl });
    } else {
        clearTabId(tabId);
    }
}

const onStorageChange = (changes: chrome.storage.StorageChange, namespace: string) => {
    for (let key in changes) {
        let { newValue, oldValue } = changes[key];

        blacklist.urls = (Array.isArray(newValue) && newValue.length > 0) 
            ? newValue 
            : [];
    }

    console.log("new blacklist set: ", blacklist.urls);
}

chrome.storage.sync.set({ savedUrlBlacklist: ['reddit.com/r/pathofexile', 'reddit.com/r/aww'] });

chrome.storage.sync.get(['savedUrlBlacklist'], ({ savedUrlBlacklist }) => {
    blacklist.urls = savedUrlBlacklist;
    console.log("blacklist read from storage: ", blacklist.urls);
});

chrome.storage.onChanged.addListener(onStorageChange);
chrome.tabs.onUpdated.addListener(onTabUpdate);