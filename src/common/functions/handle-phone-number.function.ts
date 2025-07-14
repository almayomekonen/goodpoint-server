/**
 *
 * Make sure phone saved are in the same format.
 */
export function handlePhoneNumber(phone: string | undefined) {
    if (!phone) return;
    phone = String(phone).replace(/[- ]/g, '');
    if (phone[0] !== '0') phone = '0' + phone;
    return phone;
}
