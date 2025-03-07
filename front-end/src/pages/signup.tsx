import { Button, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import AuthService from '../services/auth/auth.service';
import { RouteConstants } from '../constants/route.constants';
import breakpoints from '../constants/breakpoints.constants';
import { login } from '../features/auth/auth-slice';
import { useDispatch } from 'react-redux';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < breakpoints.mobile
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoints.mobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignup = async (values: any) => {
    setLoading(true);
    try {
      const data = await AuthService.performSignup(
        values.firstName,
        values.lastName,
        values.email,
        values.password
      );
      dispatch(
        login({
          user: { ...data, id: data._id },
          accessToken: data.accessToken,
        })
      );
      localStorage.setItem('accessToken', data.accessToken);
      navigate(RouteConstants.HOME, { state: { from: location.pathname } });
    } catch (err) {
      message.error('Signup failed. Please try again.');
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
        <h1 className='text-4xl font-bold text-center'>Let's Get Started!</h1>
        <p className='text-2xl font-bold text-center max-w-md'>
          Start capturing your moments
        </p>
      </div>

      {/* Right Section - Signup Form */}
      <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-10'>
        <div className='w-full max-w-md'>
          <h2 className='text-2xl font-semibold text-pink-600 mb-2 text-center'>
            Create an account
          </h2>
          <Form layout='vertical' onFinish={handleSignup}>
            <div
              className={`flex ${isMobile ? 'flex-col' : 'md:flex-row gap-4'}`}
            >
              <Form.Item
                label={<span style={{ color: 'white' }}>First Name</span>}
                name='firstName'
                rules={[
                  { required: true, message: 'Please enter your first name!' },
                ]}
                className='w-full'
              >
                <Input placeholder='Enter First Name' />
              </Form.Item>
              <Form.Item
                label={<span style={{ color: 'white' }}>Last Name</span>}
                name='lastName'
                rules={[
                  { required: true, message: 'Please enter your last name!' },
                ]}
                className='w-full'
              >
                <Input placeholder='Enter Last Name' />
              </Form.Item>
            </div>
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
            <Form.Item
              label={<span style={{ color: 'white' }}>Confirm Password</span>}
              name='confirmPassword'
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder='Confirm Password' />
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
                {loading ? 'Signing up...' : 'Signup'}
              </Button>
            </Form.Item>
          </Form>
          <p className='mt-4 text-center'>
            Already have an account?{' '}
            <Link to='/login' style={{ color: '#ff66b2' }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
