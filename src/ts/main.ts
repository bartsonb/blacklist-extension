import { Blacklist } from './modules/Blacklist';

let blacklist = new Blacklist();

const redirectionUrl = chrome.extension.getURL('html/blocked.html');

const onTabUpdate = (tabId: number, changeInfo: any, { url }: any): void => {
    if (
        blacklist.isBlockedUrl(url) &&
        !blacklist.isBlockedTabId(tabId)
    ) {
        blacklist.addId(tabId);
        chrome.tabs.update(tabId, { url: redirectionUrl });
    } else {
        blacklist.clearId(tabId);
    }
}

const onStorageChange = (
    changes: { [key: string]: chrome.storage.StorageChange }, 
    namespace: string
) => {
    for (let key in changes) {
        let { newValue } = changes[key];
        
        blacklist.setUrls(newValue);
    }
}

// Initial loading of stored blacklist
chrome.storage.sync.get(['storageBlacklist'], ({ storageBlacklist }) => {
    blacklist.setUrls(storageBlacklist);
});

chrome.storage.onChanged.addListener(onStorageChange);
chrome.tabs.onUpdated.addListener(onTabUpdate);