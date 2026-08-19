/**
 * Services — Trimly's catalog page: the service menu and the chairs that
 * run it, from the same fixture data the Calendar draws its bookings from
 * (`../lib/trimly-fixtures`), so the two pages never disagree.
 */
import { SERVICES, STAFF, STUDIO_NAME } from "../lib/trimly-fixtures";

export function Services() {
  return (
    <div className="page">
      <header className="cal-header">
        <div>
          <h1>Services</h1>
          <p className="calm">What the {STUDIO_NAME} chairs offer — and who runs them.</p>
        </div>
        <span className="tag-mock">mock data</span>
      </header>

      <section className="card">
        <h2>Service menu</h2>
        <table className="services-table">
          <thead>
            <tr>
              <th scope="col">Service</th>
              <th scope="col">Duration</th>
              <th scope="col">Price</th>
              <th scope="col">Staff</th>
            </tr>
          </thead>
          <tbody>
            {SERVICES.map((service) => (
              <tr key={service.name}>
                <td>{service.name}</td>
                <td>{service.duration}</td>
                <td>{service.price}</td>
                <td>{service.staff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>Staff</h2>
        <div className="staff-grid">
          {STAFF.map((member) => (
            <div key={member.name} className="staff-card">
              <span aria-hidden className="staff-avatar">
                {member.initials}
              </span>
              <div>
                <p className="staff-name">{member.name}</p>
                <p className="staff-meta">
                  {member.role} · {member.thisWeek}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
