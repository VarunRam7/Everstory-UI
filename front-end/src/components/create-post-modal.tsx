import { Modal, Upload, message } from 'antd';

import ImageService from '../services/image/image-service';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onPostCreated: () => void;
  userId: string;
}

const CreatePostModal = ({
  visible,
  onClose,
  onPostCreated,
  userId,
}: CreatePostModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      message.error('Please select a file to upload.');
      return;
    }

    setLoading(true);
    try {
      await ImageService.uploadPost(file, userId);
      message.success('Post uploaded successfully!');
      onPostCreated();
      onClose();
    } catch (error) {
      console.error('Error uploading post:', error);
      message.error('Failed to upload post.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (file: File) => {
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    return false; // Prevent automatic upload
  };

  return (
    <Modal
      title='Create New Post'
      visible={visible}
      onCancel={onClose}
      footer={null}
      closable={false}
      maskClosable={true}
      className='custom-post-modal'
    >
      <div className='flex flex-col gap-4'>
        <Upload
          beforeUpload={handleFileChange}
          onRemove={() => {
            setFile(null);
            setImagePreview(null);
          }}
          maxCount={1}
          showUploadList={false}
        >
          <button className='flex items-center gap-2 p-2 bg-gray-800 text-white rounded-lg'>
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

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className='mt-4 p-2 text-white rounded-lg hover:white disabled:bg-gray-500 disabled:cursor-not-allowed'
        >
          {loading ? 'Uploading...' : 'Upload Post'}
        </button>
      </div>
    </Modal>
  );
};

export default CreatePostModal;
