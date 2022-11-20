export const validationResultMock = () => {
    return {
        isEmpty: () => false,
        array: () => [{ msg: 'test error' }],
    };
};
