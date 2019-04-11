export const constant = {
    URL_CHECK_USER: '/check_user',
    URL_FETCH_ALL_USERS: '/fetch_all_users',
    URL_ADD_NEW_USER: '/add_new_user',
    URL_DELETE_USER: '/delete_user',
    URL_UPDATE_USER: '/update_user',

    URL_GET_ALL_ACTIVE_USERS: '/get_all_active_users',
    URL_GET_ALL_ROLES: '/get_all_roles',
    URL_GET_ALL_AGENTS: '/get_all_agents',

    MODULE_COMMON: 'common',
    // tslint:disable-next-line:max-line-length
    pwdCheck: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,16}$/ //  password should be 8 to 16 char length combination of Caps letter, small letter and numbers.
};

