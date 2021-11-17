import React, { useEffect, useMemo } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';
import * as yup from 'yup';

import ClientForm from 'components/ClientForm';
import { createclient, modifyclient, fetchclients } from 'state/actions/client';
import paths from 'pages/Router/paths';
import { useFormatMessage } from 'hooks';

const schema = yup.object().shape({
    year: yup.string().notRequired(),
    birthcenter: yup.string().notRequired(),
    region: yup.string().notRequired(),
    address: yup.string().notRequired(),
    email: yup.string().notRequired(),
    isAdmin: yup.boolean().notRequired(),
    location: yup.string().notRequired(),
    createdAt: yup.string().notRequired(),
});


const Submenu = () => {
    const { id } = useParams();

    const isEditing = useMemo(() => !!id, [id]);

    const { success, userData, error } = useSelector(
        (state) => ({
            success: state.users.success,
            userData: state.users.data.find((user) => user.id === id),
            error: state.users.error,
        }),
        shallowEqual
    );

    const dispatch = useDispatch();

    useEffect(() => {
        if (isEditing) {
            if (!userData) {
                dispatch(fetchclients(id));
            }
        }
    }, [isEditing, id, userData, dispatch]);

    const redirect = ((isEditing && error) || success) && (
        <Redirect to={paths.USERS} />
    );

    const editUserMessage = useFormatMessage('User.editUser');

    const newUserMessage = useFormatMessage('User.editUser');

    const onSubmitHandler = (value) => {
        const newUser = {
            ...value,
            file: value?.file[0] || null,
            isEditing,
            id,
        };

        if (isEditing) {
            dispatch(modifyclient(newUser));
        } else {
            dispatch(createclient(newUser));
        }
    };

    return (
        <>
            {redirect}
            <section className="hero is-hero-bar">
                <div className="hero-body">
                    <h1 className="title">
                        {isEditing ? editUserMessage : newUserMessage}
                    </h1>
                </div>
            </section>
            <section className="section is-main-section ">
                {isEditing && !userData ? (
                    <ClipLoader />
                ) : (
                    <ClientForm
                        isEditing={isEditing}
                        user={
                            isEditing
                                ? userData
                                : {
                                    year: '',
                                    birthcenter: '',
                                    region: '',
                                    address: '',
                                    email:'',
                                    createdAt: new Date().toDateString(),
                                    isAdmin: false,
                                }
                        }
                        onSubmitHandler={onSubmitHandler}
                        schema={schema}
                    />
                )}
            </section>
        </>
    );
};

export default Submenu;
