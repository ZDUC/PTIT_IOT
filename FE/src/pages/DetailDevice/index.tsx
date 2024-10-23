import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getDeviceByTime } from '../../data/repositories/api';
import { convertDateInput, convertToVietnamTime } from '../../data/helper';

const Device: React.FC = () => {

    const [filteredData, setFilteredData] = useState<any[]>([]); // Dữ liệu đã lọc để hiển thị
    const [page, setPage] = useState<string>('1'); // Trang hiện tại
    const [pageSize, setPageSize] = useState<string>('10'); // Kích thước trang
    const [totalCount, setTotalCount] = useState<number>(0); // Tổng số bản ghi
    const [startInput, setStartInput] = useState<string>('');
    const [startBE, setStartBe] = useState<string>('')

    useEffect(() => {
        const fetchFirst = async () => {
            try {
                const resAll = await getDeviceByTime({
                    startTime: startInput ? startInput : '',
                    page: '',
                    pageSize: '',
                });
                setTotalCount(resAll.data.length); // Lưu tổng số bản ghi vào state totalCount
                console.log("total", resAll.data.length);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        }
        fetchFirst();
    },[startInput])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getDeviceByTime({
                    
                    startTime: startInput ? startInput : '',
                    page: page,
                    pageSize: pageSize,
                });
                console.log("result", result);
                setFilteredData(result?.data || []); // Lưu dữ liệu vào state filteredData
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        };

        fetchData();
    }, [page, pageSize, startInput]);

    const handleSearch = () => {
        if(!startBE) return;
        setStartInput(startBE);
    };

    const changePageSize = (e:React.ChangeEvent<HTMLSelectElement> ) => {
        setPageSize(e.target.value);
        setPage('1')
    }

    const totalPages = Math.ceil(totalCount / Number(pageSize));
    
    return (
        <div className="container-fluid">
            <div className="filter-section">
            <input
                type="text"
                value={startBE}
                onChange={(e) => setStartBe(e.target.value)}
                placeholder="Nhập giờ hoặc ngày tháng"
            />
                <button
                    className="filter-button"
                    onClick={handleSearch}
                    style={{
                        borderRadius: '10px',
                        background: 'linear-gradient(to right, #77A1D3 0%, #79CBCA  51%, #77A1D3  100%)',
                    }}
                >
                    Tìm kiếm
                </button>
            </div>

            {/* Căn chỉnh pageSize ở góc phải trên */}
            <div className="page-size-control" style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 0' }}>
                <label style={{ marginRight: '10px' }}>
                    Số bản ghi trên trang:
                    <select value={pageSize} onChange={changePageSize}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </label>
            </div>

            {/* Bảng hiển thị dữ liệu thiết bị */}
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Thiết bị</th>
                        <th>Hành động</th>
                        <th>Thời gian</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length > 0 ? (
                        filteredData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.deviceId}</td>
                                <td>{row.deviceName}</td>
                                <td>{row.action ? 'Bật' : 'Tắt'}</td>
                                <td>{convertToVietnamTime(row.createdAt)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center' }}>Không có dữ liệu nào để hiển thị</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Căn chỉnh page ở góc phải dưới */}
            <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 0' }}>
                <button
                    onClick={() => setPage((prev) => (parseInt(prev) - 1).toString())} // Trang trước
                    disabled={page === '1'}
                    style={{ marginRight: '10px' }}
                >
                    Trang trước
                </button>
                <span>{`Trang ${page} / ${totalPages}`}</span>
                <button
                    onClick={() => setPage((prev) => (parseInt(prev) + 1).toString())} // Trang tiếp
                    disabled={parseInt(page) >= totalPages}
                    style={{ marginLeft: '10px' }}
                >
                    Trang tiếp
                </button>
            </div>
        </div>
    );
};

export default Device;
