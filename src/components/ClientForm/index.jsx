/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import classNames from 'classnames';
import { yupResolver } from '@hookform/resolvers';

import { usersCleanUp } from 'state/actions/users';
import { useFormatDate, useFormatMessage } from 'hooks';
import DatePicker from 'components/DatePicker';
import ErrorMessage from 'components/ErrorMessage';

import './UserForm.scss';

const ClientForm = ({ isEditing, isProfile, user, onSubmitHandler, schema }) => {
  const { loading, success } = useSelector(
    (state) => ({
      loading: state.users.loading,
      success: state.users.success,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  const history = useHistory();

  const { register, handleSubmit, errors, control, watch, setValue } = useForm({
    defaultValues: { ...user },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (success) {
      setValue('file', null);
    }
    return () => dispatch(usersCleanUp());
  }, [dispatch, success, setValue]);

  const invalidEmailMessage = useFormatMessage('UserForm.invalidEmail');

  const imagePreviewUrl =
    watch('file') && watch('file')[0]
      ? URL.createObjectURL(watch('file')[0])
      : user.logoUrl;

  const goBackMessage = useFormatMessage('UserForm.goBack');

  const pickAnotherFileMessage = useFormatMessage('UserForm.pickAnotherFile');
  const pickFileMessage = useFormatMessage('UserForm.pickFile');

  const emailMessage = useFormatMessage('UserForm.email');

  const adminMessage = useFormatMessage('UserForm.admin');

  return (
    <>
      <div className="tile is-ancestor">
        <div className="tile is-parent">
          <div className="card tile is-child">
            <header className="card-header">
              <p className="card-header-title">
                <span className="icon">
                  <i className="mdi mdi-account-edit default" />
                </span>
                Client Information
              </p>
            </header>
            <div className="card-content">
              <form onSubmit={handleSubmit(onSubmitHandler)}>

              
                {isEditing ? (
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label">{emailMessage}</label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <div className="control">
                          <input
                            type="text"
                            readOnly="readOnly"
                            className="input is-static"
                            name="email"
                            ref={register}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                  {/* First row */}
                  <div className="field">
                    <div className="label">
                      <div className="field-body">
                        {/* Year */}
                        <div className="field">
                          <div className="control">
                            <input type="text" className="input" placeholder="Year"/>
                          </div>
                        </div>
                        {/* Birthing Center */}
                        <div className="field">
                          <div className="control">
                            <input type="text" className="input" placeholder="Birthing Center"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Second row */}
                  <div className="field">
                    <div className="label">
                      <div className="field-body">
                        {/* Region */}
                        <div className="field">
                          <div className="control">
                            <input type="text" className="input" placeholder="Region"/>
                          </div>
                        </div>
                        {/* Address */}
                        <div className="field">
                          <div className="control">
                            <input type="text" className="input" placeholder="Address"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Third row */}
                  <div className="field">
                    <div className="label">
                      <div className="field-body">
                        {/* Province */}
                        <div className="field">
                          <div className="control">
                            <input type="text" className="input" placeholder="Province"/>
                          </div>
                        </div>
                        {/* Referral Center */}
                        <div className="field">
                          <div className="control">
                            <input type="text" className="input" placeholder="Referral Center"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fourth row */}
                  <div className="field">
                    <div className="label">
                      <div className="field-body">
                        {/* Municipality */}
                        <div className="field">
                          <div className="control">
                            <input type="text" className="input" placeholder="Municipality"/>
                          </div>
                        </div>
                        {/* Address */}
                        <div className="field">
                          <div className="control">
                            <input type="text" className="input" placeholder="Address"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fifth row */}
                  <div className="field">
                    <div className="label">
                      <div className="field-body">
                        {/* Barangay */}
                        <div className="field">
                          <div className="control">
                            <input type="text" className="input" placeholder="Barangay"/>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                  
                  <hr />

                  {/* Name */}
                    <div className="field">
                      <div className="label">
                        <label className="label">Name</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input  className="input"
                                    placeholder="First Name"
                              // className={classNames(`input`, {
                              //   'is-danger': errors.email,
                              // })}
                              // ref={register}
                              // name="email"
                            />
                          </div>
                        </div>
                        <div className="field">
                          <div className="control">
                            <input  className="input"
                                    placeholder="Middle Name"
                              // className={classNames(`input`, {
                              //   'is-danger': errors.email,
                              // })}
                              // ref={register}
                              // name="email"
                            />
                          </div>
                        </div>
                        <div className="field">
                          <div className="control">
                            <input  className="input"
                                    placeholder="Last Name"
                              // className={classNames(`input`, {
                              //   'is-danger': errors.email,
                              // })}
                              // ref={register}
                              // name="email"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {errors.email && (
                      <div className="field">
                        <div className="label" />
                        <div className="field-body">
                          <ErrorMessage text={invalidEmailMessage} />
                        </div>
                      </div>
                    )}
                  </>
                )}
                {/* Age */}
                <div className="field">
                  <div className="label">
                    <label className="label">
                      Age
                    </label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <input  className="input"  
                                type="number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {errors.name && (
                  <div className="field">
                    <div className="label" />
                    <div className="field-body">
                      <ErrorMessage />
                    </div>
                  </div>
                )}

                {/* Gravidity */}
                <div className="field">
                  <div className="label">
                    <label className="label">
                      Gravidity
                    </label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          ref={register}
                          name="location"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parity */}
                <div className="field">
                  <div className="label">
                    <label className="label">
                      Parity
                    </label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          ref={register}
                          name="location"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Expected Date of Delivery */}
                <div className="field">
                  <div className="label">
                    <label className="label">
                      Expected Date of Delivery
                    </label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                    <div className="control">
                            <input  className="input" 
                                    type="date"
                            />
                          </div>
                    </div>
                  </div>
                </div>
                
                {/* Antenatal Care Check-Ups */}
                <div className="field">
                      <div className="label">
                        <label className="label">Antenatal Care Check-Ups</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input  className="input" 
                                    type="date"
                            />
                          </div>
                        </div>
                        <div className="field">
                          <div className="control">
                            <input  className="input"
                                    type="date"
                            />
                          </div>
                        </div>
                        <div className="field">
                          <div className="control">
                            <input  className="input"
                                    type="date"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pregnancy Outcome */}
                    <div className="field">
                      <div className="label">
                        <label className="label">Pregnancy Outcome </label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <label className="checkbox">
                              <input type="checkbox"/>
                              Live Birth
                            </label>
                          </div>
                        </div>
                        <div className="field">
                          <div className="control">
                            <label className="checkbox">
                              <input type="checkbox"/>
                              Preterm Birth
                            </label>
                          </div>
                        </div>
                        <div className="field">
                          <div className="control">
                            <label className="checkbox">
                              <input type="checkbox"/>
                              Stillbirth
                            </label>
                          </div>
                        </div>
                        <div className="field">
                          <div className="control">
                            <label className="checkbox">
                              <input type="checkbox"/>
                              Abortion
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mother and child postnatal check-ups */}
                    <div className="field">
                      <div className="label">
                        <label className="label">Mother and Child Postnatal Check-ups</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input  className="input" 
                                    type="date"
                            />
                          </div>
                        </div>
                        <div className="field">
                          <div className="control">
                            <input  className="input"
                                    type="date"
                            />
                          </div>
                        </div>
                      </div> 
                    </div>

                    {/* Civil Registration */}
                    <div className="field">
                      <div className="label">
                        <label className="label">Civil Registration</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input  className="input" 
                                    type="date"
                            />
                          </div>
                        </div>
                        <div className="field">
                          <div className="control">
                            <input  className="input"
                                    type="date"
                            />
                          </div>
                        </div>
                        <div className="field">
                          <div className="control">
                            <input  className="input"
                                    type="date"
                            />
                          </div>
                        </div>
                        <div className="field">
                          <div className="control">
                            <input  className="input"
                                    type="date"
                            />
                          </div>
                        </div>
                      </div> 
                    </div>

                <hr />

                <div className="field">
                    <div className="label">
                      <div className="field-body">
                        {/* Name of BHW */}
                        <div className="field">
                          <div className="control">
                            <input type="text" className="input" placeholder="Name of BHW"/>
                          </div>
                        </div>
                        {/* Barangay Health Station */}
                        <div className="field">
                          <div className="control">
                            <input type="text" className="input" placeholder="Barangay Health Station"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <div className="label">
                      <div className="field-body">
                        {/* Name of Midwife */}
                        <div className="field">
                          <div className="control">
                            <input type="text" className="input" placeholder="Name of Midwife"/>
                          </div>
                        </div>
                        {/* Rural Health Unit */}
                        <div className="field">
                          <div className="control">
                            <input type="text" className="input" placeholder="Rural Health Unit"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                <hr />
                <div className="field is-horizontal">
                  <div className="field-label" />
                  <div className="field-body">
                    <div className="field">
                      <div className="field is-grouped">
                        <div className="control">
                          <button
                            type="submit"
                            className={`button is-primary ${
                              loading && 'is-loading'
                            }`}
                          >
                            <span>{useFormatMessage('UserForm.submit')}</span>
                          </button>
                        </div>
                        {!isProfile && (
                          <div
                            onClick={() => history.goBack()}
                            className="button"
                          >
                            {goBackMessage}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* <div className="tile is-parent preview">
          <div className="card tile is-child">
            <header className="card-header">
              <p className="card-header-title">
                <span className="icon">
                  <i className="mdi mdi-account default" />
                </span>
                {useFormatMessage('UserForm.userPreview')}
              </p>
            </header>
            <div className="card-content">
              {imagePreviewUrl && (
                <>
                  <div className="is-user-avatar image has-max-width is-aligned-center">
                    <img
                      className="user-avatar"
                      src={imagePreviewUrl}
                      alt="User profile logo preview"
                    />
                  </div>
                  <hr />
                </>
              )}

              {!isEditing && (
                <div className="field">
                  <label className="label">{emailMessage}</label>
                  <div className="control is-clearfix">
                    <input
                      data-testid="email"
                      type="text"
                      readOnly="readOnly"
                      className="input is-static"
                      value={watch('email')}
                    />
                  </div>
                </div>
              )}

              <div className="field">
                <label className="label">
                  {useFormatMessage('UserForm.name')}
                </label>
                <div className="control is-clearfix">
                  <input
                    data-testid="name"
                    type="text"
                    readOnly="readOnly"
                    className="input is-static"
                    value={watch('name')}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">
                  {useFormatMessage('UserForm.location')}
                </label>
                <div className="control is-clearfix">
                  <input
                    data-testid="location"
                    type="text"
                    readOnly="readOnly"
                    className="input is-static"
                    value={watch('location')}
                  />
                </div>
              </div>

              {!isProfile && (
                <div className="field">
                  <label className="label">{adminMessage}</label>
                  <div className="control is-clearfix" data-testid="admin">
                    {watch('isAdmin') ? (
                      <span className="icon">
                        <i className="mdi mdi-check" />
                      </span>
                    ) : (
                      <span className="icon">
                        <i className="mdi mdi-close" />
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="field">
                <label className="label">
                  {useFormatMessage('UserForm.created')}
                </label>
                <div className="control is-clearfix" data-testid="date">
                  <p className="date">
                    {useFormatDate(watch('createdAt'), {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      
    </>
  );
};

ClientForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    isAdmin: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string,
    logoUrl: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onSubmitHandler: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  schema: PropTypes.object.isRequired,
  isEditing: PropTypes.bool,
  isProfile: PropTypes.bool,
};

ClientForm.defaultProps = {
  isEditing: false,
  isProfile: false,
};

export default ClientForm;
