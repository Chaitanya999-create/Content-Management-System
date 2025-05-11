
import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  const [pages, setPages] = useState(() => {
    const saved = localStorage.getItem('cms_pages');
    return saved ? JSON.parse(saved) : [];
  });

  const [drafts, setDrafts] = useState(() => {
    const saved = localStorage.getItem('cms_drafts');
    return saved ? JSON.parse(saved) : [];
  });

  const [media, setMedia] = useState(() => {
    const saved = localStorage.getItem('cms_media');
    return saved ? JSON.parse(saved) : [];
  });

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('cms_pages', JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem('cms_drafts', JSON.stringify(drafts));
  }, [drafts]);

  useEffect(() => {
    localStorage.setItem('cms_media', JSON.stringify(media));
  }, [media]);

  const createPage = (pageData) => {
    const newPage = {
      id: Date.now().toString(),
      ...pageData,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      status: 'draft',
    };

    setDrafts(prev => [...prev, newPage]);
    toast({
      title: "Draft Created",
      description: "Your page has been saved as a draft.",
    });
    return newPage;
  };

  const updatePage = (pageId, updates) => {
    const updateInCollection = (collection, setCollection) => {
      const index = collection.findIndex(p => p.id === pageId);
      if (index !== -1) {
        const updatedCollection = [...collection];
        updatedCollection[index] = { ...updatedCollection[index], ...updates };
        setCollection(updatedCollection);
        return true;
      }
      return false;
    };

    if (updateInCollection(pages, setPages)) {
      toast({
        title: "Page Updated",
        description: "Changes have been saved successfully.",
      });
    } else if (updateInCollection(drafts, setDrafts)) {
      toast({
        title: "Draft Updated",
        description: "Your draft has been updated.",
      });
    }
  };

  const deletePage = (pageId) => {
    const deleteFromCollection = (collection, setCollection) => {
      const filtered = collection.filter(p => p.id !== pageId);
      if (filtered.length !== collection.length) {
        setCollection(filtered);
        return true;
      }
      return false;
    };

    if (deleteFromCollection(pages, setPages) || deleteFromCollection(drafts, setDrafts)) {
      toast({
        title: "Page Deleted",
        description: "The page has been removed.",
      });
    }
  };

  const publishPage = (pageId) => {
    const draft = drafts.find(d => d.id === pageId);
    if (draft) {
      const publishedPage = {
        ...draft,
        status: 'published',
        publishedAt: new Date().toISOString(),
        publishedBy: user.id,
      };
      setPages(prev => [...prev, publishedPage]);
      setDrafts(prev => prev.filter(d => d.id !== pageId));
      toast({
        title: "Page Published",
        description: "Your page is now live.",
      });
    }
  };

  const uploadMedia = (file) => {
    // In a real app, this would handle file uploads to a storage service
    const newMedia = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedBy: user.id,
      uploadedAt: new Date().toISOString(),
    };
    setMedia(prev => [...prev, newMedia]);
    toast({
      title: "Media Uploaded",
      description: "Your file has been uploaded successfully.",
    });
    return newMedia;
  };

  const deleteMedia = (mediaId) => {
    setMedia(prev => {
      const filtered = prev.filter(m => m.id !== mediaId);
      if (filtered.length !== prev.length) {
        toast({
          title: "Media Deleted",
          description: "The file has been removed.",
        });
      }
      return filtered;
    });
  };

  return (
    <ContentContext.Provider value={{
      pages,
      drafts,
      media,
      createPage,
      updatePage,
      deletePage,
      publishPage,
      uploadMedia,
      deleteMedia,
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = React.useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
