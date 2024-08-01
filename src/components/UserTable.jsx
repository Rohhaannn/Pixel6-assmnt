import React, { useState, useEffect } from 'react';
import axios from 'axios';
import menu from '../../public/menu.png'
import filter from '../../public/filter.png'

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [filters, setFilters] = useState({ gender: '', country: '' });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, sortConfig, filters]);

  const fetchUsers = async () => {
    const response = await axios.get(`https://dummyjson.com/users?limit=100`);
    const allUsers = response.data.users;

    // filters
    const filteredUsers = allUsers.filter(user => {
      return (
        (!filters.gender || user.gender === filters.gender) &&
        (!filters.country || user.country === filters.country)
      );
    });

    // sorting
    if (sortConfig.key) {
      filteredUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    const usersPerPage = 10;
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    setTotalPages(totalPages);

    const startIndex = (currentPage - 1) * usersPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);
    setUsers(paginatedUsers);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1);
    fetchUsers();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">

      <div className='flex justify-end space-x-4 mb-4'>
        <img src={menu} width={25} alt="menu icon"  />
      </div>


      <div className="flex justify-between mb-4">

        <h1 className='text-[35px] font-bold'>Employees</h1>

        <div className='flex items-center space-x-5'>

          <img src={filter} width={25} alt="filter icon" />

          <select name="country" onChange={handleFilterChange} className="p-2 border rounded">
            <option value="">Country</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
          </select>
          <select name="gender" onChange={handleFilterChange} className="p-2 border rounded">
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

        </div>
      </div>


      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')} className="border border-gray-300 p-2 cursor-pointer">ID</th>
            <th className="border border-gray-300 p-2">Image</th>
            <th onClick={() => handleSort('name')} className="border border-gray-300 p-2 cursor-pointer">Name</th>
            <th className="border border-gray-300 p-2">Demography</th>
            <th className="border border-gray-300 p-2">Designation</th>
            <th className="border border-gray-300 p-2">Location</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b text-center">{user.id}</td>
                <td className="py-2 px-4 border-b text-center">
                <img src={user.image} alt={user.firstName} className="w-16 h-16 rounded-full mx-auto" />
                </td>
                <td className="py-2 px-4 border-b text-center">{user.firstName} {user.maidenName} {user.lastName}</td>
                <td className="py-2 px-4 border-b text-center">{user.gender === "female" ? 'F' : 'M'}/{user.age}</td>
                <td className="py-2 px-4 border-b text-center">{user.company.title}</td>
                <td className="py-2 px-4 border-b text-center">{user.address ? `${user.address.state}, ${user.address.country}` : 'N/A'}</td>
              </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserTable;

