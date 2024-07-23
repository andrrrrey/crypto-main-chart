import { useEffect, useState } from "react";
import axios from "axios";

function useGetData(url: string) {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = import.meta.env.VITE_API_KEY;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: token,
          },
        });
        setData(response.data.data);
      } catch (error: any) {
        setData([]);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);
  return { data, loading, error };
}

export default useGetData;
