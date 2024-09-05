import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogin } from 'state';

const OAuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleTokenCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      console.log(urlParams);
      const tokenParam = urlParams.get('token');
      const userParam = urlParams.get('user');

      if (tokenParam && userParam) {
        const user = JSON.parse(decodeURIComponent(userParam));

        console.log(user, tokenParam);

        dispatch(
          setLogin({
            user: user,
            token: tokenParam,
          })
        );
        navigate('/home');
      } else {
        console.error('Token or user data missing in URL');
        // navigate('/');
      }
    };

    handleTokenCallback();
  }, [dispatch, navigate]);

  return (
    <div>Loading...</div>
  );
};

export default OAuthCallback;
