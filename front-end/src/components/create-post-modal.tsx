import { Input, Modal, Upload, message, notification } from 'antd';

import ImageService from '../services/image/image.service';
import { UploadOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
}

const CreatePostModal = ({
  visible,
  onClose,
  userId,
}: CreatePostModalProps) => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const showError = (description: string) => {
    api['error']({
      message: 'Oops 🚨',
      description,
    });
  };

  const handleUpload = async () => {
    if (!file) {
      message.error('Please select an image to upload.');
      return;
    }

    setLoading(true);
    try {
      await ImageService.uploadPost(file, caption);
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      api['success']({
        message: 'Post uploaded successfully 🎉',
      });
      resetFile();
      onClose();
    } catch (error) {
      console.error('Error uploading post:', error);
      showError('Failed to upload post. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const resetFile = () => {
    setFile(null);
    setImagePreview(null);
    setCaption('');
  };

  const handleFileChange = (file: File) => {
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    return false;
  };

  return (
    <Modal
      title='Create New Post'
      open={visible}
      onCancel={() => {
        onClose();
        resetFile();
      }}
      footer={null}
      closable={false}
      maskClosable={true}
      className='custom-post-modal'
    >
      {contextHolder}
      <div className='flex flex-col gap-4'>
        <Upload
          beforeUpload={handleFileChange}
          onRemove={resetFile}
          maxCount={1}
          showUploadList={false}
          disabled={loading}
        >
          <button
            className={`flex items-center gap-2 p-2 bg-gray-800 text-white rounded-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            <UploadOutlined /> Select Image
          </button>
        </Upload>

        {imagePreview && (
          <div className='mt-4'>
            <img
              src={imagePreview}
              alt='Preview'
              className='w-full h-auto rounded-lg'
            />
          </div>
        )}

        <Input.TextArea
          style={{
            backgroundColor: '#222',
            color: '#bbb',
            caretColor: '#bbb',
            fontWeight: 600,
          }}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder='Enter a Caption...'
          rows={3}
          maxLength={150}
          className='p-2 border rounded-lg focus:ring-2 focus:ring-white outline-none'
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`mt-4 p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 ${
            (!file || loading) && 'bg-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <span className='dot-loading'>Uploading</span>
          ) : (
            'Upload Post'
          )}
        </button>
      </div>
    </Modal>
  );
};

export default CreatePostModal;
