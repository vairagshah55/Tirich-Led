import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardPage.module.css';
import Seo from '../../components/Seo/Seo';

const DashboardPage = ({ onLogout, authUser, onAuthRefresh }) => {
  const navigate = useNavigate();
  const [resolvedUser, setResolvedUser] = useState(authUser);
  const roles = resolvedUser?.roles || [];
  const isSuperadmin = roles.includes('superadmin');
  const isAdmin = roles.includes('admin');

  const [admins, setAdmins] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [adminErrors, setAdminErrors] = useState({});
  const [retailerForm, setRetailerForm] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    adminId: '',
  });
  const [retailerErrors, setRetailerErrors] = useState({});
  const [productForm, setProductForm] = useState({
    retailerId: '',
    name: '',
    sku: '',
    price: '',
    description: '',
    status: 'active',
  });
  const [productErrors, setProductErrors] = useState({});
  const [editingProductId, setEditingProductId] = useState(null);

  const handleLogout = () => {
    const rawBase =
      process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';
    const apiBase = rawBase.endsWith('/api')
      ? `${rawBase}/v1`
      : rawBase.replace(/\/$/, '');

    fetch(`${apiBase}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {
      // Ignore network errors on logout, still clear local state
    });

    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  const apiBase = useMemo(() => {
    const rawBase =
      process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';
    return rawBase.endsWith('/api') ? `${rawBase}/v1` : rawBase.replace(/\/$/, '');
  }, []);

  useEffect(() => {
    setResolvedUser(authUser);
  }, [authUser]);

  useEffect(() => {
    if (resolvedUser && (resolvedUser.roles || []).length > 0) return;
    const refreshUser = async () => {
      try {
        const res = await fetch(`${apiBase}/auth/me`, {
          credentials: 'include',
          cache: 'no-store',
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.data?.user) {
          setResolvedUser(data.data.user);
          if (onAuthRefresh) {
            onAuthRefresh(data.data.user);
          }
        }
      } catch (_) {
        // ignore
      }
    };

    refreshUser();
  }, [apiBase, onAuthRefresh, resolvedUser]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (isSuperadmin) {
        const [adminsRes, retailersRes] = await Promise.all([
          fetch(`${apiBase}/admins`, { credentials: 'include' }),
          fetch(`${apiBase}/retailers`, { credentials: 'include' }),
        ]);
        const adminsData = await adminsRes.json();
        console.log(adminsData.data)
        const retailersData = await retailersRes.json();

        if (!adminsRes.ok) {
          throw new Error(adminsData?.message || 'Failed to load admins');
        }
        if (!retailersRes.ok) {
          throw new Error(retailersData?.message || 'Failed to load retailers');
        }

        setAdmins(adminsData.data || []);
        setRetailers(retailersData.data || []);
        const productsRes = await fetch(`${apiBase}/products`, {
          credentials: 'include',
        });
        const productsData = await productsRes.json();
        if (!productsRes.ok) {
          throw new Error(productsData?.message || 'Failed to load products');
        }
        setProducts(productsData.data || []);
        return;
      }

      if (isAdmin) {
        const res = await fetch(`${apiBase}/retailers`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || 'Failed to load retailers');
        }
        setRetailers(data.data || []);
        const productsRes = await fetch(`${apiBase}/products`, {
          credentials: 'include',
        });
        const productsData = await productsRes.json();
        if (!productsRes.ok) {
          throw new Error(productsData?.message || 'Failed to load products');
        }
        setProducts(productsData.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperadmin, isAdmin]);

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRetailerChange = (e) => {
    const { name, value } = e.target;
    setRetailerForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitAdmin = async (e) => {
    e.preventDefault();
    setAdminErrors({});
    setError('');
    try {
      const res = await fetch(`${apiBase}/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(adminForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setAdminErrors(data?.errors || {});
        throw new Error(data?.message || 'Failed to create admin');
      }
      setAdminForm({ name: '', email: '', password: '' });
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to create admin');
    }
  };

  const submitRetailer = async (e) => {
    e.preventDefault();
    setRetailerErrors({});
    setError('');
    try {
      const payload = {
        name: retailerForm.name,
        email: retailerForm.email,
        password: retailerForm.password,
        businessName: retailerForm.businessName,
      };
      if (isSuperadmin && retailerForm.adminId) {
        payload.adminId = Number(retailerForm.adminId);
      }

      const res = await fetch(`${apiBase}/retailers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setRetailerErrors(data?.errors || {});
        throw new Error(data?.message || 'Failed to create retailer');
      }
      setRetailerForm({
        name: '',
        email: '',
        password: '',
        businessName: '',
        adminId: '',
      });
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to create retailer');
    }
  };

  const updateRetailerStatus = async (id, status) => {
    setError('');
    try {
      const res = await fetch(
        `${apiBase}/retailers/${id}/${status === 'active' ? 'activate' : 'deactivate'}`,
        {
          method: 'PATCH',
          credentials: 'include',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to update retailer status');
      }
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to update retailer status');
    }
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    setProductErrors({});
    setError('');

    const payload = {
      retailerId: Number(productForm.retailerId),
      name: productForm.name,
      sku: productForm.sku || null,
      price: Number(productForm.price),
      description: productForm.description || null,
      status: productForm.status || 'active',
    };

    try {
      const res = await fetch(
        `${apiBase}/products${editingProductId ? `/${editingProductId}` : ''}`,
        {
          method: editingProductId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setProductErrors(data?.errors || {});
        throw new Error(data?.message || 'Failed to save product');
      }

      setProductForm({
        retailerId: '',
        name: '',
        sku: '',
        price: '',
        description: '',
        status: 'active',
      });
      setEditingProductId(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    }
  };

  const startEditProduct = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      retailerId: product.retailer_id,
      name: product.name,
      sku: product.sku || '',
      price: product.price,
      description: product.description || '',
      status: product.status || 'active',
    });
  };

  const deleteProduct = async (id) => {
    setError('');
    try {
      const res = await fetch(`${apiBase}/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to delete product');
      }
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    }
  };

  return (
    <div className={styles.container}>
      <Seo title="Dashboard" path="/dashboard" noindex nofollow />
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>
              Signed in as {resolvedUser?.name || resolvedUser?.email}
            </p>
            <div className={styles.roleChips}>
              {roles.map((role) => (
                <span key={role} className={styles.roleChip}>
                  {role}
                </span>
              ))}
            </div>
          </div>
          <button
            className={styles.logoutButton}
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {loading && <p className={styles.loading}>Loading...</p>}

        {isSuperadmin && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Create Admin</h2>
            <form className={styles.form} onSubmit={submitAdmin}>
              <div className={styles.row}>
                <input
                  className={styles.input}
                  name="name"
                  placeholder="Name"
                  value={adminForm.name}
                  onChange={handleAdminChange}
                />
                <input
                  className={styles.input}
                  name="email"
                  placeholder="Email"
                  value={adminForm.email}
                  onChange={handleAdminChange}
                />
              </div>
              <div className={styles.row}>
                <input
                  className={styles.input}
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={adminForm.password}
                  onChange={handleAdminChange}
                />
                <button className={styles.primaryButton} type="submit">
                  Create Admin
                </button>
              </div>
              {Object.keys(adminErrors).length > 0 && (
                <div className={styles.fieldErrors}>
                  {Object.entries(adminErrors).map(([key, message]) => (
                    <div key={key}>{key}: {message}</div>
                  ))}
                </div>
              )}
            </form>

            <h3 className={styles.subTitle}>Admins</h3>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span>Name</span>
                <span>Email</span>
                <span>Status</span>
                <span>Retailers</span>
              </div>
              {admins.map((admin) => (
                <div key={admin.id} className={styles.tableRow}>
                  <span>{admin.name}</span>
                  <span>{admin.email}</span>
                  <span>{admin.status}</span>
                  <span>{admin.retailers_count}</span>
                </div>
              ))}
              {admins.length === 0 && (
                <div className={styles.empty}>No admins yet.</div>
              )}
            </div>
          </section>
        )}

        {(isSuperadmin || isAdmin) && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Create Retailer</h2>
            <form className={styles.form} onSubmit={submitRetailer}>
              <div className={styles.row}>
                <input
                  className={styles.input}
                  name="name"
                  placeholder="Retailer Name"
                  value={retailerForm.name}
                  onChange={handleRetailerChange}
                />
                <input
                  className={styles.input}
                  name="email"
                  placeholder="Email"
                  value={retailerForm.email}
                  onChange={handleRetailerChange}
                />
              </div>
              <div className={styles.row}>
                <input
                  className={styles.input}
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={retailerForm.password}
                  onChange={handleRetailerChange}
                />
                <input
                  className={styles.input}
                  name="businessName"
                  placeholder="Business Name"
                  value={retailerForm.businessName}
                  onChange={handleRetailerChange}
                />
              </div>
              {isSuperadmin && (
                <div className={styles.row}>
                  <select
                    className={styles.input}
                    name="adminId"
                    value={retailerForm.adminId}
                    onChange={handleRetailerChange}
                  >
                    <option value="">Select Admin</option>
                    {admins.map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {admin.name} ({admin.email})
                      </option>
                    ))}
                  </select>
                  <button className={styles.primaryButton} type="submit">
                    Create Retailer
                  </button>
                </div>
              )}
              {isAdmin && (
                <div className={styles.row}>
                  <button className={styles.primaryButton} type="submit">
                    Create Retailer
                  </button>
                </div>
              )}
              {Object.keys(retailerErrors).length > 0 && (
                <div className={styles.fieldErrors}>
                  {Object.entries(retailerErrors).map(([key, message]) => (
                    <div key={key}>{key}: {message}</div>
                  ))}
                </div>
              )}
            </form>

            <h3 className={styles.subTitle}>Retailers</h3>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span>Name</span>
                <span>Email</span>
                <span>Business</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {retailers.map((retailer) => (
                <div key={retailer.id} className={styles.tableRow}>
                  <span>{retailer.name}</span>
                  <span>{retailer.email}</span>
                  <span>{retailer.business_name}</span>
                  <span>{retailer.status}</span>
                  <span className={styles.actions}>
                    <button
                      className={styles.smallButton}
                      type="button"
                      onClick={() => updateRetailerStatus(retailer.id, 'active')}
                      disabled={retailer.status === 'active'}
                    >
                      Activate
                    </button>
                    <button
                      className={styles.smallButtonSecondary}
                      type="button"
                      onClick={() => updateRetailerStatus(retailer.id, 'inactive')}
                      disabled={retailer.status === 'inactive'}
                    >
                      Deactivate
                    </button>
                  </span>
                </div>
              ))}
              {retailers.length === 0 && (
                <div className={styles.empty}>No retailers yet.</div>
              )}
            </div>
          </section>
        )}

        {(isSuperadmin || isAdmin) && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Product Catalog</h2>
            <form className={styles.form} onSubmit={submitProduct}>
              <div className={styles.row}>
                <select
                  className={styles.input}
                  name="retailerId"
                  value={productForm.retailerId}
                  onChange={handleProductChange}
                >
                  <option value="">Select Retailer</option>
                  {retailers.map((retailer) => (
                    <option key={retailer.id} value={retailer.id}>
                      {retailer.name} ({retailer.email})
                    </option>
                  ))}
                </select>
                <input
                  className={styles.input}
                  name="name"
                  placeholder="Product Name"
                  value={productForm.name}
                  onChange={handleProductChange}
                />
              </div>
              <div className={styles.row}>
                <input
                  className={styles.input}
                  name="sku"
                  placeholder="SKU"
                  value={productForm.sku}
                  onChange={handleProductChange}
                />
                <input
                  className={styles.input}
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={productForm.price}
                  onChange={handleProductChange}
                />
              </div>
              <div className={styles.row}>
                <input
                  className={styles.input}
                  name="description"
                  placeholder="Description"
                  value={productForm.description}
                  onChange={handleProductChange}
                />
                <select
                  className={styles.input}
                  name="status"
                  value={productForm.status}
                  onChange={handleProductChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className={styles.row}>
                <button className={styles.primaryButton} type="submit">
                  {editingProductId ? 'Update Product' : 'Create Product'}
                </button>
                {editingProductId && (
                  <button
                    className={styles.secondaryButton}
                    type="button"
                    onClick={() => {
                      setEditingProductId(null);
                      setProductForm({
                        retailerId: '',
                        name: '',
                        sku: '',
                        price: '',
                        description: '',
                        status: 'active',
                      });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              {Object.keys(productErrors).length > 0 && (
                <div className={styles.fieldErrors}>
                  {Object.entries(productErrors).map(([key, message]) => (
                    <div key={key}>{key}: {message}</div>
                  ))}
                </div>
              )}
            </form>

            <h3 className={styles.subTitle}>Products</h3>
            <div className={styles.table}>
              <div className={styles.tableHeaderProducts}>
                <span>Name</span>
                <span>SKU</span>
                <span>Price</span>
                <span>Status</span>
                <span>Retailer</span>
                <span>Actions</span>
              </div>
              {products.map((product) => (
                <div key={product.id} className={styles.tableRowProducts}>
                  <span>{product.name}</span>
                  <span>{product.sku || '-'}</span>
                  <span>{product.price}</span>
                  <span>{product.status}</span>
                  <span>{product.retailer_name || product.retailer_email}</span>
                  <span className={styles.actions}>
                    <button
                      className={styles.smallButton}
                      type="button"
                      onClick={() => startEditProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.smallButtonSecondary}
                      type="button"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </span>
                </div>
              ))}
              {products.length === 0 && (
                <div className={styles.empty}>No products yet.</div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
