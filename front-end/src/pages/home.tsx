import { Modal, Spin, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import AuthService from '../services/auth/auth.service';
import { EllipsisOutlined } from '@ant-design/icons';
import ImageService from '../services/image/image.service';
import RelationshipService from '../services/friendship/relationship.service';
import { RootState } from '../store';
import { RouteConstants } from '../constants/route.constants';
import { getInitials } from '../utils/string.utils';
import { imageSocket } from '../context/image-socket';
import { isUndefined } from 'lodash';
import { login } from '../features/auth/auth-slice';
import { useInView } from 'react-intersection-observer';

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const user = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const showError = (description: string) => {
    api['error']({
      message: 'Oops 🚨',
      description,
    });
  };

  const fetchProfile = async () => {
    try {
      const userProfile = await AuthService.getProfile();
      dispatch(
        login({
          user: { ...userProfile, id: userProfile._id },
          accessToken:
            localStorage.getItem('accessToken') || 'dummy_access_token',
        })
      );
    } catch (error) {
      showError('Error fetching user profile');
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['homeFeed', user?.id],
    queryFn: async ({ pageParam = 1 }) => {
      return await ImageService.getHomeFeed(user?.id || '', pageParam, 6);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.posts.length > 0 ? allPages.length + 1 : undefined;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (!sessionStorage.getItem('initialLoading')) {
      if (
        location.state?.from === RouteConstants.LOGIN ||
        location.state?.from === '/'
      ) {
        api['success']({
          message: 'Logged into Everstory successfully 🎉',
        });
      } else if (location.state?.from === RouteConstants.SIGNUP) {
        api['success']({
          message: `Looks like you're all set 🎉`,
          description: 'Welcome to Everstory',
        });
      }
      sessionStorage.setItem('initialLoading', 'true');
    }
  }, []);

  useEffect(() => {
    imageSocket.on('postsUpdated', () => {
      refetch();
    });

    return () => {
      imageSocket.off('postsUpdated');
    };
  }, [refetch]);

  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleUnfollow = async (post: any) => {
    try {
      await RelationshipService.unfollowUser(post.userId);
      queryClient.invalidateQueries({ queryKey: ['homeFeed'] });

      api.success({ message: 'User unfollowed successfully 🎉' });
    } catch (error: any) {
      showError(error || 'Failed to unfollow user');
    }
  };

  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [menuPost, setMenuPost] = useState<any>(null);

  return (
    <>
      {contextHolder}
      <div className='gap-4 p-4 w-[50%] custom-width justify-self-center'>
        {isLoading ? (
          <div className='flex justify-center w-full'>
            <Spin size='large' />
          </div>
        ) : (
          data?.pages.map((page: any, index) => (
            <div key={index} className='grid grid-cols-1 gap-6 mt-4'>
              {page.posts.map((post: any) => (
                <div
                  key={post._id}
                  className='relative  border-b-3 border-[#222] border-br-none'
                >
                  <div
                    className='flex justify-between cursor-pointer items-center bg-black p-2 rounded-md'
                    onClick={() => {
                      if (post.user) navigate(`/user/${post.userId}`);
                      else navigate(RouteConstants.PROFILE);
                    }}
                  >
                    <div className='flex items-center gap-2'>
                      {post.user ? (
                        post.user.profilePhoto ? (
                          <img
                            src={post.user.profilePhoto}
                            alt={`${
                              post.user?.firstName || user?.firstName
                            } Profile`}
                            className='w-8 h-8 rounded-full'
                          />
                        ) : (
                          <div className='bg-white text-black px-[6px] py-[4px] font-bold text-xs rounded-md'>
                            {getInitials(
                              post.user?.firstName || user?.firstName || ''
                            )}
                            {getInitials(
                              post.user?.lastName || user?.lastName || ''
                            )}
                          </div>
                        )
                      ) : user?.profilePhoto ? (
                        <img
                          src={user.profilePhoto}
                          alt={`${user?.firstName || user?.firstName} Profile`}
                          className='w-8 h-8 rounded-full'
                        />
                      ) : (
                        <div className='bg-white text-black px-[6px] py-[4px] font-bold text-xs rounded-md'>
                          {getInitials(
                            user?.firstName || user?.firstName || ''
                          )}
                          {getInitials(user?.lastName || user?.lastName || '')}
                        </div>
                      )}
                      <span className='text-white font-semibold'>
                        {post.user?.firstName || user?.firstName}{' '}
                        {post.user?.lastName || user?.lastName}
                      </span>
                    </div>
                    <EllipsisOutlined
                      className='text-white text-xl cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuPost(post);
                      }}
                    />
                  </div>

                  <div className='relative group overflow-hidden rounded-lg border-[#222] rounded-br-none rounded-bl-none'>
                    {!loadedImages[post._id] && (
                      <div className='w-full h-[500px] bg-gray-300 animate-pulse rounded-lg'></div>
                    )}

                    <img
                      src={post.imageUrl}
                      alt='Post'
                      className={`w-full h-[500px] object-cover transition-all duration-300 rounded-lg
                   ${loadedImages[post._id] ? 'opacity-100' : 'opacity-0'}
                   group-hover:scale-105 group-hover:brightness-110 mb-[10px]`}
                      onLoad={() =>
                        setLoadedImages((prev) => ({
                          ...prev,
                          [post._id]: true,
                        }))
                      }
                    />

                    <div className='absolute inset-0 flex items-end justify-center bg-black/60 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 p-2'>
                      <p className='text-white font-semibold text-sm'>
                        {post.caption}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}

        {hasNextPage && (
          <div ref={ref} className='flex justify-center w-full py-4'>
            {isFetchingNextPage && <Spin size='large' />}
          </div>
        )}

        <Modal
          open={!!selectedPost}
          onCancel={() => setSelectedPost(null)}
          closable={false}
          footer={null}
          centered
        >
          {selectedPost && (
            <div className='relative flex justify-center items-center'>
              <img
                src={selectedPost.imageUrl}
                alt='Selected Post'
                className='w-full h-auto rounded-lg'
              />
            </div>
          )}
        </Modal>

        <Modal
          open={!!menuPost}
          onCancel={() => setMenuPost(null)}
          footer={null}
          centered
          maskClosable={true}
          className='custom-profile-modal'
          closable={false}
        >
          {menuPost && (
            <div className='flex flex-col text-center'>
              {menuPost.user &&
                (isUndefined(menuPost.user.showUnfollow) ||
                  menuPost.user.showUnfollow) && (
                  <button
                    onClick={() => {
                      handleUnfollow(menuPost);
                      setMenuPost(null);
                    }}
                    className='text-red-500 text-md py-3 !border-b-1 !rounded-br-none !rounded-bl-none !border-b-gray-700 w-full'
                  >
                    Unfollow
                  </button>
                )}
              <button
                className='text-gray-200 !border-b-1 !rounded-br-none !rounded-bl-none !border-b-gray-700 text-md py-3 w-full'
                onClick={() => {
                  setSelectedPost(menuPost);
                  setMenuPost(null);
                }}
              >
                Go to post
              </button>
              <button
                className='text-gray-500 text-md py-3 w-full'
                onClick={() => setMenuPost(null)}
              >
                Cancel
              </button>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default Home;
