// lib/actionRewardNotice.ts

export type RewardNoticeState = {
  round: number;
  needMinted: boolean;
  updatedAt: number;
};

const isBrowser = typeof window !== 'undefined';

export function buildActionRewardNoticeKey(account: string, tokenAddress: string) {
  return `love20:actionReward:${account.toLowerCase()}:${tokenAddress.toLowerCase()}`;
}

export function loadActionRewardNotice(account?: string, tokenAddress?: string): RewardNoticeState | null {
  if (!isBrowser || !account || !tokenAddress) return null;
  try {
    const raw = localStorage.getItem(buildActionRewardNoticeKey(account, tokenAddress));
    return raw ? (JSON.parse(raw) as RewardNoticeState) : null;
  } catch {
    return null;
  }
}

export function saveActionRewardNotice(account: string, tokenAddress: string, state: RewardNoticeState) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(buildActionRewardNoticeKey(account, tokenAddress), JSON.stringify(state));
  } catch {}
}

export function setActionRewardNeedMinted(account: string, tokenAddress: string, needMinted: boolean) {
  if (!isBrowser || !account || !tokenAddress) return;
  try {
    const prev = loadActionRewardNotice(account, tokenAddress);
    const nextState: RewardNoticeState = {
      round: prev?.round ?? 0,
      needMinted,
      updatedAt: Date.now(),
    };
    saveActionRewardNotice(account, tokenAddress, nextState);

    try {
      const detail = {
        account: account.toLowerCase(),
        tokenAddress: tokenAddress.toLowerCase(),
        needMinted,
      };
      window.dispatchEvent(new CustomEvent('love20:actionReward:changed', { detail }));
    } catch {}
  } catch {}
}
