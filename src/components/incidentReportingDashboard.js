import React, { useState, useEffect, useContext } from "react";
import { SiteContext } from "../SiteContext";
import { Routes, Route } from "react-router-dom";
import { FaInfoCircle, FaRegTrashAlt, FaPlus, FaRegEye } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { WiTime9 } from "react-icons/wi";
import {
  BsPencilFill,
  BsFillCircleFill,
  BsFillExclamationTriangleFill,
} from "react-icons/bs";
import { GoPerson } from "react-icons/go";
import {
  Radio,
  Tabs,
  Input,
  Combobox,
  Table,
  TableActions,
  Moment,
  Checkbox,
  moment,
} from "./elements";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Modal, Prompt } from "./modal";
import paths from "./path";
import s from "./incidentReportingDashboard.module.scss";

const incidentType = [
  {
    label: "Unsafe condition",
    value: 1,
  },
  {
    label: "No Harm",
    value: 2,
  },
  {
    label: "Near Miss",
    value: 4,
  },
  {
    label: "Adverse Event",
    value: 7,
  },
  {
    label: "Sentinel Event",
    value: 8,
  },
];
const irStatuses = [
  { id: 1, name: "Saved" },
  { id: 2, name: "Submitted" },
  { id: 3, name: "Assigned" },
  { id: 4, name: "Under investigation" },
  { id: 5, name: "CAPA planning" },
  { id: 6, name: "Closure confirmation sent" },
  { id: 7, name: "Closure confirmed" },
  { id: 8, name: "IR closed" },
  { id: 9, name: "Cancelled" },
];
function IncidentReportingDashboard() {
  const { checkPermission } = useContext(SiteContext);
  return (
    <div className={s.container}>
      <header>
        <h3>INCIDENT REPORTING DASHBOARD</h3>
      </header>
      <Tabs
        tabs={[
          { label: "My Dashboard", path: paths.incidentDashboard.myDashboard },
          ...(checkPermission({ roleId: [10, 11] })
            ? [
                {
                  label: "Quality Dashboard",
                  path: paths.incidentDashboard.qualityDashboard,
                },
              ]
            : []),
        ]}
      />
      <Routes>
        <Route
          path={paths.incidentDashboard.myDashboard + "/*"}
          element={<MyDashboard />}
        />
        {checkPermission({ roleId: [10, 11] }) && (
          <Route
            path={paths.incidentDashboard.qualityDashboard + "/*"}
            element={<QualityDashboard />}
          />
        )}
      </Routes>
    </div>
  );
}
const MyDashboard = () => {
  const { user } = useContext(SiteContext);
  const location = useLocation();
  const [parameters, setParameters] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [filters, setFilters] = useState({});
  const [focus, setFocus] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    Promise.all([
      fetch(`${process.env.REACT_APP_HOST}/location`).then((res) => res.json()),
      fetch(`${process.env.REACT_APP_HOST}/category`).then((res) => res.json()),
      fetch(`${process.env.REACT_APP_HOST}/user`).then((res) => res.json()),
    ]).then(([location, category, user]) => {
      const _parameters = { ...parameters };
      if (location?._embedded.location) {
        _parameters.locations = location._embedded.location;
      }
      if (category?._embedded.category) {
        _parameters.categories = category._embedded.category;
      }
      if (user?._embedded.user) {
        _parameters.users = user._embedded.user.map((user) => ({
          label: user.name,
          value: user.id,
        }));
        _parameters.investigators = user._embedded.user
          .map((user) => ({
            ...user,
            role: user.role
              .split(",")
              .filter((r) => r)
              .map((r) => +r),
          }))
          .filter((user) => user.role.includes(12))
          .map((user) => ({
            label: user.name,
            value: user.id,
          }));
      }
      setParameters(_parameters);
    });
    if (location.state?.focus) {
      setFocus(location.state.focus);
    }
  }, []);
  useEffect(() => {
    if (Object.entries(filters).length) {
      fetch(
        `${
          process.env.REACT_APP_HOST
        }/IncidentReport/search/byDetails?${new URLSearchParams({
          ...filters,
        }).toString()}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data._embedded?.IncidentReport) {
            setIncidents(data._embedded.IncidentReport);
          }
        });
    } else {
      fetch(`${process.env.REACT_APP_HOST}/IncidentReport`)
        .then((res) => res.json())
        .then((data) => {
          if (data._embedded?.IncidentReport) {
            setIncidents(data._embedded.IncidentReport);
          }
        });
    }
  }, [filters]);
  return (
    <div className={s.myDashboard}>
      <div className={s.reportCounts}>
        <ReportCount
          className="open"
          label="OPEN IRS"
          irs={[
            { label: "My IRs", count: 0 },
            { label: "Department IRs", count: 10 },
          ]}
        />
        <ReportCount
          className="pending"
          label="PENDING"
          irs={[
            { label: "IR Query", count: 0 },
            { label: "CAPA Actions", count: 5 },
            { label: "IR Acknowledgement", count: 5 },
          ]}
        />
        <ReportCount
          className="closure"
          label="IR CLOSURE"
          irs={[
            { label: "IR Closure", count: 0 },
            { label: "Addendum", count: 5 },
            { label: "CAPA Closure", count: 5 },
          ]}
        />
      </div>
      <Filters
        onSubmit={(values) => {
          const _filters = {};
          for (var field in values) {
            if (values[field]) _filters[field] = values[field];
          }
          console.log(values);
          if (values.userId) {
            _filters.userId = user.id;
          }
          if (values.department) {
            _filters.department = user.department;
          }
          console.log(_filters);
          setFilters(_filters);
        }}
      />
      <Table
        columns={[
          { label: "IR Code" },
          { label: "Reporting Date & Time" },
          { label: "Incident Date & Time" },
          { label: "Incident Location" },
          { label: "Category" },
          { label: "Subcategory" },
          { label: "Incident Type" },
          { label: "Reported / Captured by" },
          { label: "IR Investigator" },
          { label: "Status" },
          { label: "TAT" },
          { label: "Actions" },
        ]}
        actions={true}
      >
        {incidents
          .sort((a, b) =>
            new Date(a.reportingDate) > new Date(b.reportingDate) ? -1 : 1
          )
          .map((inc) => (
            <tr
              key={inc.id}
              className={focus === inc.id ? s.focus : ""}
              onClick={() => setFocus(inc.id)}
            >
              <td>{inc.sequence}</td>
              <td>
                <Moment format="DD/MM/YYYY hh:mm">{inc.reportingDate}</Moment>
              </td>
              <td>
                <Moment format="DD/MM/YYYY hh:mm">
                  {inc.incident_Date_Time}
                </Moment>
              </td>
              <td>
                {parameters?.locations.find((item) => item.id === inc.location)
                  ?.name || inc.location}
              </td>
              <td>
                {parameters?.categories.find(
                  (item) => item.id === inc.inciCateg
                )?.name || inc.inciCateg}
              </td>
              <td>
                {parameters?.categories
                  .find((item) => item.id === inc.inciCateg)
                  ?.subCategorys?.find((item) => item.id === inc.inciSubCat)
                  ?.name || inc.inciSubCat}
              </td>
              <td>
                {incidentType.find(({ value }) => value === inc.typeofInci)
                  ?.label || [inc.typeofInci]}
              </td>
              <td>
                {parameters?.users.find(({ value }) => value === inc.userId)
                  ?.label || "Anonymous"}
              </td>
              <td>
                {parameters?.investigators.find(
                  ({ value }) => value === inc.irInvestigator
                )?.label || inc.irInvestigator}
              </td>
              <td>
                {irStatuses.find((item) => item.id === +inc.status)?.name ||
                  inc.status}
              </td>
              <td>{inc.tat}</td>
              <TableActions
                actions={[
                  ...(+inc.status === 2
                    ? [
                        {
                          icon: <FaRegEye />,
                          label: "Review IR",
                          callBack: () => {
                            navigate(paths.incidentReport, {
                              state: {
                                edit: inc,
                                readOnly: true,
                                focus: inc.id,
                                from: location.pathname,
                              },
                            });
                          },
                        },
                      ]
                    : [
                        {
                          icon: <BsPencilFill />,
                          label: "Edit",
                          callBack: () => {
                            navigate(paths.incidentReport, {
                              state: {
                                edit: inc,
                                focus: inc.id,
                                from: location.pathname,
                              },
                            });
                          },
                        },
                        {
                          icon: <FaRegTrashAlt />,
                          label: "Delete",
                          callBack: () => {
                            Prompt({
                              type: "confirmation",
                              message:
                                "Are you sure you want to delete this report?",
                              callback: () => {
                                fetch(
                                  `${process.env.REACT_APP_HOST}/IncidentReport/${inc.id}`,
                                  { method: "DELETE" }
                                ).then((res) => {
                                  if (res.status === 204) {
                                    setIncidents((prev) =>
                                      prev.filter((ir) => ir.id !== inc.id)
                                    );
                                  }
                                });
                              },
                            });
                          },
                        },
                      ]),
                ]}
              />
            </tr>
          ))}
      </Table>
      <div className={s.legend}>
        <span>
          <span className={s.icon} style={{ color: "rgb(230, 16, 54)" }}>
            <BsFillCircleFill />
          </span>{" "}
          Sentinel Event
        </span>
        <span>
          <span className={s.icon} style={{ color: "rgb(230, 163, 16)" }}>
            <WiTime9 />
          </span>{" "}
          IRs Beyond TAT
        </span>
        <span>
          <span className={s.icon} style={{ color: "rgb(115, 49, 162)" }}>
            <BsFillExclamationTriangleFill />
          </span>{" "}
          Reportable Incident
        </span>
        <span>
          <span className={s.icon} style={{ color: "rgb(230, 112, 16)" }}>
            <GoPerson />
          </span>{" "}
          Patient Complient
        </span>
      </div>
    </div>
  );
};
const ReportCount = ({ label, className, irs }) => {
  return (
    <div className={`${s.reportCount} ${s[className]}`}>
      <h4>{label}</h4>
      <div className={s.data}>
        {irs.map((ir) => (
          <span key={ir.label}>
            <label>{ir.label} - </label>
            {ir.count}
          </span>
        ))}
      </div>
    </div>
  );
};
const Filters = ({ onSubmit, qualityDashboard }) => {
  const { handleSubmit, register, watch, reset, setValue } = useForm();
  const [categories, setCategories] = useState([]);
  const [irInvestigator, setIrInvestigator] = useState([]);
  useEffect(() => {
    Promise.all([
      fetch(`${process.env.REACT_APP_HOST}/category`).then((res) => res.json()),
      fetch(`${process.env.REACT_APP_HOST}/user`).then((res) => res.json()),
    ]).then(([category, users]) => {
      if (category._embedded?.category) {
        setCategories(
          category._embedded.category.map(({ id, name }) => ({
            value: id,
            label: name,
          }))
        );
      }
      if (users._embedded?.user) {
        setIrInvestigator(
          users._embedded.user
            .map((user) => ({
              ...user,
              role: user.role
                .split(",")
                .filter((r) => r)
                .map((r) => +r),
            }))
            .filter((user) => user.role.includes(10))
            .map((user) => ({ label: user.name, value: user.id }))
        );
      }
    });
  }, []);
  return (
    <form className={s.filters} onSubmit={handleSubmit(onSubmit)}>
      <Input label="IR Code" {...register("sequence")} />
      <Combobox
        label="Category"
        name="InciCateg"
        setValue={setValue}
        watch={watch}
        multiple={true}
        register={register}
        options={categories}
      />
      <section className={s.pair}>
        <label>Incident Date Range</label>
        <Input
          type="date"
          placeholder="From"
          {...register("fromIncidentDateTime", {
            // validate: (v) =>
            //   new Date(v) < new Date() || "Can not select date from future",
          })}
          max={moment({ format: "YYYY-MM-DDThh:mm", time: new Date() })}
        />
        <Input
          type="date"
          placeholder="To"
          {...register("toIncidentDateTime", {
            // validate: (v) =>
            //   new Date(v) < new Date() || "Can not select date from future",
          })}
        />
      </section>
      <section className={s.pair}>
        <label>Reporting Date Range</label>
        <Input
          type="date"
          placeholder="From"
          {...register("fromreportingDate")}
        />
        <Input type="date" placeholder="To" {...register("toreportingDate")} />
      </section>
      <Combobox
        label="Incident Type"
        name="incidentType"
        setValue={setValue}
        watch={watch}
        multiple={true}
        register={register}
        options={incidentType}
      />
      <section className={s.pair}>
        <Combobox
          label="IR Investigator"
          name="irInvestigator"
          setValue={setValue}
          watch={watch}
          register={register}
          options={irInvestigator}
          multiple={true}
        />
        <Combobox
          label="Status"
          name="status"
          setValue={setValue}
          watch={watch}
          register={register}
          multiple={true}
          options={irStatuses.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
        />
      </section>
      {!qualityDashboard && (
        <section className={`${s.pair} ${s.checkboxes}`}>
          <Radio
            register={register}
            name="userId"
            options={[
              {
                label: "My IRs",
                value: 1,
              },
              {
                label: "My Department IRs",
                value: 2,
              },
            ]}
          />
        </section>
      )}
      <section className={s.btns}>
        <button className="btn secondary">
          <BiSearch /> Search
        </button>
        <button
          type="button"
          className={`btn clear ${s.clear}`}
          onClick={() => {
            reset();
            onSubmit({});
          }}
        >
          Clear
        </button>
      </section>
    </form>
  );
};

const QualityDashboard = () => {
  const { user, checkPermission } = useContext(SiteContext);
  const [parameters, setParameters] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [filters, setFilters] = useState({});
  const [assign, setAssign] = useState(null);
  useEffect(() => {
    Promise.all([
      fetch(`${process.env.REACT_APP_HOST}/location`).then((res) => res.json()),
      fetch(`${process.env.REACT_APP_HOST}/category`).then((res) => res.json()),
      fetch(`${process.env.REACT_APP_HOST}/user`).then((res) => res.json()),
    ])
      .then(([location, category, user]) => {
        const _parameters = { ...parameters };
        if (location?._embedded.location) {
          _parameters.locations = location._embedded.location;
        }
        if (category?._embedded.category) {
          _parameters.categories = category._embedded.category;
        }
        if (user?._embedded.user) {
          _parameters.users = user._embedded.user.map((user) => ({
            label: user.name,
            value: user.id,
          }));
          _parameters.investigators = user._embedded.user
            .map((user) => ({
              ...user,
              role: user.role
                .split(",")
                .filter((r) => r)
                .map((r) => +r),
            }))
            .filter((user) => user.role.includes(12))
            .map((user) => ({
              label: user.name,
              value: user.id,
            }));
        }
        setParameters(_parameters);
        return fetch(
          `${process.env.REACT_APP_HOST}/IncidentReport`
        ).then((res) => res.json());
      })
      .then((data) => {
        if (data._embedded?.IncidentReport) {
          setIncidents(data._embedded.IncidentReport);
        }
      });
  }, []);
  useEffect(() => {
    if (Object.entries(filters).length) {
      fetch(
        `${
          process.env.REACT_APP_HOST
        }/IncidentReport/search/byDetails?${new URLSearchParams({
          ...filters,
        }).toString()}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data._embedded?.IncidentReport) {
            setIncidents(data._embedded.IncidentReport);
          }
        });
    } else {
      fetch(`${process.env.REACT_APP_HOST}/IncidentReport`)
        .then((res) => res.json())
        .then((data) => {
          if (data._embedded?.IncidentReport) {
            setIncidents(data._embedded.IncidentReport);
          }
        });
    }
  }, [filters]);
  return (
    <div className={s.qualityDashboard}>
      <Filters
        onSubmit={(values) => {
          const _filters = {};
          for (var field in values) {
            if (values[field]) _filters[field] = values[field];
          }
          console.log(values);
          setFilters(_filters);
        }}
        qualityDashboard={true}
      />
      <Table
        columns={[
          { label: "IR Code" },
          { label: "Reporting Date & Time" },
          { label: "Incident Date & Time" },
          { label: "Incident Location" },
          { label: "Category" },
          { label: "Subcategory" },
          { label: "Incident Type" },
          { label: "Reported / Captured by" },
          { label: "IR Investigator" },
          { label: "Status" },
          { label: "TAT" },
          { label: "Actions" },
        ]}
        actions={true}
      >
        {incidents
          .sort((a, b) =>
            new Date(a.reportingDate) > new Date(b.reportingDate) ? -1 : 1
          )
          .map((inc) => (
            <tr key={inc.id}>
              <td>{inc.sequence}</td>
              <td>
                <Moment format="DD/MM/YYYY hh:mm">{inc.reportingDate}</Moment>
              </td>
              <td>
                <Moment format="DD/MM/YYYY hh:mm">
                  {inc.incident_Date_Time}
                </Moment>
              </td>
              <td>
                {parameters?.locations.find((item) => item.id === inc.location)
                  ?.name || inc.location}
              </td>
              <td>
                {parameters?.categories.find(
                  (item) => item.id === inc.inciCateg
                )?.name || inc.inciCateg}
              </td>
              <td>
                {parameters?.categories
                  .find((item) => item.id === inc.inciCateg)
                  ?.subCategorys?.find((item) => item.id === inc.inciSubCat)
                  ?.name || inc.inciSubCat}
              </td>
              <td>
                {incidentType.find(({ value }) => value === inc.typeofInci)
                  ?.label || inc.typeofInci}
              </td>
              <td>
                {parameters?.users.find(({ value }) => value === inc.userId)
                  ?.label || "Anonymous"}
              </td>
              <td>
                {parameters?.investigators.find(
                  ({ value }) => value === inc.irInvestigator
                )?.label || inc.irInvestigator}
              </td>
              <td>
                {irStatuses.find((item) => item.id === +inc.status)?.name ||
                  inc.status}
              </td>
              <td>{inc.tat}</td>
              <TableActions
                actions={[
                  ...(checkPermission({
                    roleId: 11,
                    permission: "Assign IRs",
                  }) && [2, 3].includes(+inc.status)
                    ? [
                        {
                          icon: <FaRegTrashAlt />,
                          label:
                            +inc.status === 2 ? "Assign IR" : "Re-assign IR",
                          callBack: () => setAssign(inc),
                        },
                      ]
                    : []),
                  ...(+inc.status === 2
                    ? [
                        {
                          icon: <BsPencilFill />,
                          label: "Review IR",
                          callBack: () => {},
                        },
                        ...(checkPermission({
                          roleId: [11, 10],
                          permission: "Cancel IRs",
                        })
                          ? [
                              {
                                icon: <FaRegTrashAlt />,
                                label: "Cancel IR",
                                callBack: () => {},
                              },
                            ]
                          : []),
                        {
                          icon: <FaRegTrashAlt />,
                          label: "Reportable Incident",
                          callBack: () => {},
                        },
                        {
                          icon: <FaRegTrashAlt />,
                          label: "Merge/Un-Merge IR",
                          callBack: () => {},
                        },
                      ]
                    : []),
                  ...(checkPermission({
                    roleId: [11, 12],
                    permission: "Approve IRs",
                  })
                    ? [
                        {
                          icon: <FaRegTrashAlt />,
                          label: "IR Approval",
                          callBack: () => {},
                        },
                      ]
                    : []),
                  {
                    icon: <FaRegTrashAlt />,
                    label: "IR Combine",
                    callBack: () => {},
                  },
                  {
                    icon: <FaRegTrashAlt />,
                    label: "IR Investigation",
                    callBack: () => {},
                  },
                  {
                    icon: <FaRegTrashAlt />,
                    label: "CAPA",
                    callBack: () => {},
                  },
                  {
                    icon: <FaRegTrashAlt />,
                    label: "IR Closure",
                    callBack: () => {},
                  },
                ]}
              />
            </tr>
          ))}
      </Table>
      <div className={s.legend}>
        <span>
          <span className={s.icon} style={{ color: "rgb(230, 16, 54)" }}>
            <BsFillCircleFill />
          </span>{" "}
          Sentinel Event
        </span>
        <span>
          <span className={s.icon} style={{ color: "rgb(230, 163, 16)" }}>
            <WiTime9 />
          </span>{" "}
          IRs Beyond TAT
        </span>
        <span>
          <span className={s.icon} style={{ color: "rgb(115, 49, 162)" }}>
            <BsFillExclamationTriangleFill />
          </span>{" "}
          Reportable Incident
        </span>
        <span>
          <span className={s.icon} style={{ color: "rgb(230, 112, 16)" }}>
            <GoPerson />
          </span>{" "}
          Patient Complient
        </span>
      </div>
      <Modal
        head={true}
        label={+assign?.status === 2 ? "ASSIGN IR" : "RE-ASSIGN IR"}
        open={assign}
        setOpen={setAssign}
        className={s.assignModal}
      >
        <div className={s.content}>
          <ul className={s.irDetail}>
            <li>IR Code: {assign?.sequence}</li>
            <li>
              Incident Date & Time:{" "}
              <Moment format="DD/MM/YYYY hh:mma">
                {assign?.incident_Date_Time}
              </Moment>
            </li>
            <li>
              Incidnet Type:{" "}
              {incidentType.find(({ value }) => value === assign?.typeofInci)
                ?.label || assign?.typeofInci}
            </li>
            <li>
              Category:{" "}
              {parameters?.categories.find(
                (item) => item.id === assign?.inciCateg
              )?.name || assign?.inciCateg}
            </li>
            <li>
              Location:{" "}
              {parameters?.locations.find(
                (item) => item.id === assign?.location
              )?.name || assign?.location}
            </li>
            <li>
              Sub Category:{" "}
              {parameters?.categories
                .find((item) => item.id === assign?.inciCateg)
                ?.subCategorys?.find((item) => item.id === assign?.inciSubCat)
                ?.name || assign?.inciSubCat}
            </li>
          </ul>
          <AssignForm
            assign={assign}
            users={parameters?.investigators}
            setAssign={setAssign}
            onSuccess={(incident) => {
              setIncidents((prev) =>
                prev.map((inc) => (inc.id === incident.id ? incident : inc))
              );
            }}
          />
        </div>
      </Modal>
    </div>
  );
};
const AssignForm = ({ assign, users, setAssign, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [timeline, setTimeline] = useState([
    {
      id: 454,
      status: "Assigned",
      user: {
        name: "Ganesh",
        id: 23,
      },
      dateTime: "2022-02-01T00:00:00",
    },
  ]);
  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  return (
    <>
      {timeline && +assign.status === 3 && (
        <ul className={s.timeline}>
          {timeline.map((evt) => (
            <li key={evt.id}>
              <span className={s.ball} />
              <p>
                <span className={s.status}>{evt.status}</span> to{" "}
                {evt.user.name} on{" "}
                <Moment format="DD/MM/YYYY">{evt.dateTime}</Moment> at{" "}
                <Moment format="hh:mma">{evt.dateTime}</Moment>
              </p>
            </li>
          ))}
          <li>
            <span className={`${s.ball} ${s.new}`} />
            <p>Re-assign</p>
            <span className={s.ir}>IR</span>
          </li>
        </ul>
      )}
      <form
        onSubmit={handleSubmit((data) => {
          setLoading(true);
          fetch(`${process.env.REACT_APP_HOST}/IncidentReport/${assign.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...assign,
              irInvestigator: data.user,
              status: 3,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              setLoading(false);
              if (data.id) {
                setAssign(null);
                onSuccess(data);
              }
            })
            .catch((err) => {
              setLoading(false);
              console.log(err);
            });
        })}
      >
        <Combobox
          className={s.userCombo}
          label="Select User to assign:"
          name="user"
          register={register}
          formOptions={{
            required: "Select an Investigator",
          }}
          error={errors.user}
          setValue={setValue}
          watch={watch}
          options={users}
        />
        <section className={s.btns}>
          <button
            className="btn secondary ghost w-100"
            type="button"
            onClick={() => setAssign(null)}
          >
            Close
          </button>
          <button className="btn w-100" disabled={loading}>
            Assign
          </button>
        </section>
      </form>
    </>
  );
};

export default IncidentReportingDashboard;
