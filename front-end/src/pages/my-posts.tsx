import { Modal, Spin, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { DeleteOutlined } from '@ant-design/icons';
import ImageService from '../services/image/image.service';
import { RootState } from '../store';
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';

type MyPostsProps = {
  setTotalPosts: (count: number) => void;
};

const MyPosts: React.FC<MyPostsProps> = ({ setTotalPosts }) => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [api, contextHolder] = notification.useNotification();

  const showError = (description: string) => {
    api['error']({
      message: 'Oops 🚨',
      description,
    });
  };

  const queryClient = useQueryClient();

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['myPosts', userId],
      queryFn: async ({ pageParam = 1 }) => {
        return await ImageService.getMyPosts(userId || '', pageParam, 6);
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.posts.length > 0 ? allPages.length + 1 : undefined;
      },
      enabled: !!userId,
      staleTime: 1000 * 60 * 5,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (data?.pages.length) {
      const totalCount = data.pages[0].totalCount;
      setTotalPosts(totalCount);
    }
  }, [data, setTotalPosts]);

  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const handleDeletePost = async () => {
    if (!selectedPost) return;

    try {
      await ImageService.deletePost(selectedPost._id, selectedPost.imageUrl);
      api['success']({
        message: 'Post deleted successfully 🎉',
      });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      setDeleteConfirmVisible(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Failed to delete post:', error);
      showError('Failed to delete post. Please try again!');
    }
  };

  return (
    <div className='gap-4 p-4'>
      {contextHolder}
      {isLoading ? (
        <div className='flex justify-center w-full'>
          <Spin size='large' />
        </div>
      ) : (
        data?.pages.map((page: any, index) => (
          <div key={index} className='grid grid-cols-3 gap-4 mt-4'>
            {page.posts.map((post: any) => (
              <div
                key={post._id}
                className='relative group overflow-hidden rounded-lg cursor-pointer'
                onClick={() => setSelectedPost(post)}
              >
                {!loadedImages[post._id] && (
                  <div className='w-full h-120 bg-gray-300 animate-pulse rounded-lg'></div>
                )}

                <img
                  src={post.imageUrl}
                  alt='Post'
                  className={`w-full h-120 object-cover rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 ${
                    loadedImages[post._id] ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() =>
                    setLoadedImages((prev) => ({ ...prev, [post._id]: true }))
                  }
                />

                <div className='absolute inset-0 flex items-end justify-center bg-black/60 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 p-2'>
                  <p className='text-white font-semibold text-sm'>
                    {post.caption}
                  </p>
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
        footer={null}
        centered
        className='w-full max-w-3xl'
        closable={false}
      >
        {selectedPost && (
          <div className='relative flex justify-center items-center'>
            {/* Delete Button */}
            <button
              className='absolute top-4 right-4 text-red-500 text-xl hover:text-red-700 transition'
              onClick={() => setDeleteConfirmVisible(true)}
            >
              <DeleteOutlined />
            </button>

            {/* Full-size Image */}
            <img
              src={selectedPost.imageUrl}
              alt='Selected Post'
              className='w-full h-auto rounded-lg'
            />
          </div>
        )}
      </Modal>

      <Modal
        open={deleteConfirmVisible}
        closable={false}
        maskClosable={true}
        className='custom-profile-modal'
        onCancel={() => setDeleteConfirmVisible(false)}
        footer={null}
        centered
      >
        <div className='flex flex-col text-center'>
          <h3
            style={{ fontFamily: 'Figtree' }}
            className='text-lg font-semibold text-white px-4 py-6 border-b border-gray-600'
          >
            Delete Post? <br />{' '}
            <span className='font-light text-sm'>
              Are you sure you want to delete this post?
            </span>
          </h3>

          <button
            className='text-red-500 text-md py-3 border-b border-gray-600 w-full'
            onClick={handleDeletePost}
          >
            Delete
          </button>

          <button
            className='text-white text-md py-3 w-full'
            onClick={() => setDeleteConfirmVisible(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MyPosts;
