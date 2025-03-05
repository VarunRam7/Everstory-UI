import { Button, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import AuthService from '../services/auth/auth-service';
import { RouteConstants } from '../constants/route.constants';
import breakpoints from '../constants/breakpoints.constants';
import { login } from '../features/auth/auth-slice';
import { useDispatch } from 'react-redux';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < breakpoints.mobile
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoints.mobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const data = await AuthService.performLogin(
        values.email,
        values.password
      );
      dispatch(login({ user: data, accessToken: data.accessToken }));
      localStorage.setItem('accessToken', data.accessToken);
      message.success('Login successful!');
      navigate(RouteConstants.HOME);
    } catch (err) {
      message.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex ${
        isMobile ? 'flex-col' : 'md:flex-row'
      } h-screen w-screen`}
    >
      {/* Left Section - Pink Gradient */}
      <div className='w-full md:w-1/2 bg-gradient-to-b from-pink-300 to-pink-500 flex flex-col justify-center items-center text-white p-10'>
        <div className='flex flex-row mb-5'>
          <p className='font-[cursive] text-5xl font-bold text-center max-w-md'>
            EVERSTORY
          </p>
        </div>
        <h1 className='text-4xl font-bold text-center'>Welcome Back!</h1>
        <p className='text-2xl font-bold text-center max-w-md'>
          Place where moments never fade
        </p>
      </div>

      {/* Right Section - Login Form */}
      <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-10'>
        <div className='w-full max-w-md'>
          <h2 className='text-2xl font-semibold text-pink-600 mb-2 text-center'>
            Login to your account
          </h2>
          <Form layout='vertical' onFinish={handleLogin}>
            <Form.Item
              label={<span style={{ color: 'white' }}>Email address</span>}
              name='email'
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Invalid email!' },
              ]}
            >
              <Input placeholder='Enter Email address' />
            </Form.Item>
            <Form.Item
              label={<span style={{ color: 'white' }}>Password</span>}
              name='password'
              rules={[
                { required: true, message: 'Please enter your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
            >
              <Input.Password placeholder='Enter Password' />
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                loading={loading}
                block
                style={{
                  backgroundColor: '#ff8aa1',
                  borderColor: '#ff8aa1',
                  fontWeight: 'bold',
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form.Item>
          </Form>
          <p className='mt-4 text-center'>
            Don't have an account?{' '}
            <Link to='/signup' style={{ color: '#ff66b2' }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
