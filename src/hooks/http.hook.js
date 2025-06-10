import {useState, useCallback} from 'react';

export const useHttp = () => {
  const [process, setProcess] = useState('waiting'); 

  
  
  const request = useCallback(
    async (url, method = 'GET', body = null, headers = {'Content-type': 'application/json'}) => {
      setProcess('loading');

      
      try {
        const response = await fetch(url, {method, body, headers}); 

        
        if (!response.ok) {
          throw new Error(`Could not fetch ${url}, status: ${response.status}`);
        }

        
        const data = await response.json(); 

        return data; 
      } catch (e) {
        setProcess('error');
        
        console.warn('Ошибка запроса', e.message); 
        return null; 
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setProcess('loading');
  }, []); 

  return {process, setProcess, request, clearError}; 
}; 





