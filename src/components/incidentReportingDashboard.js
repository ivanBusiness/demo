import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { FaInfoCircle, FaRegTrashAlt, FaPlus } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { WiTime9 } from "react-icons/wi";
import {
  BsPencilFill,
  BsFillCircleFill,
  BsFillExclamationTriangleFill,
} from "react-icons/bs";
import { GoPerson } from "react-icons/go";
import { Tabs, Input, Combobox, Table, TableActions, Moment } from "./elements";
import { useForm } from "react-hook-form";
import s from "./incidentReportingDashboard.module.scss";

function IncidentReportingDashboard() {
  return (
    <div className={s.container}>
      <header>
        <h3>INCIDENT REPORTING DASHBOARD</h3>
      </header>
      <Tabs
        tabs={[
          { label: "My Dashboard", path: "my-dashboard" },
          { label: "Quality Dashboard", path: "quality-dashboard" },
        ]}
      />
      <Routes>
        <Route path="my-dashboard/*" element={<MyDashboard />} />
        <Route path="quality-dashboard/*" element={<QualityDashboard />} />
      </Routes>
    </div>
  );
}
const MyDashboard = ({}) => {
  const [incidents, setIncidents] = useState([
    {
      id: 1,
      code: "40",
      reportedAt: "2021-12-21T15:56:09.153Z",
      incidentTime: "2021-12-21T15:56:09.153",
      location: "OT",
      category: "My Dashboard",
      subCategory: "My Subdashboard",
      incidentType: "Sentinel",
      reportedBy: "John goodman",
      irInvestigator: "Mike",
      status: "Open",
      tat: "5",
    },
    {
      id: 2,
      code: "40",
      reportedAt: "2021-12-21T15:56:09.153Z",
      incidentTime: "2021-12-21T15:56:09.153",
      location: "OT",
      category: "My Dashboard",
      subCategory: "My Subdashboard",
      incidentType: "Sentinel",
      reportedBy: "John goodman",
      irInvestigator: "Mike",
      status: "Open",
      tat: "5",
    },
    {
      id: 3,
      code: "40",
      reportedAt: "2021-12-21T15:56:09.153Z",
      incidentTime: "2021-12-21T15:56:09.153",
      location: "OT",
      category: "My Dashboard",
      subCategory: "My Subdashboard",
      incidentType: "Sentinel",
      reportedBy: "John goodman",
      irInvestigator: "Mike",
      status: "Open",
      tat: "5",
    },
  ]);
  const [filters, setFilters] = useState({});
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
      <Filters onSubmit={(values) => setFilters(values)} />
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
      >
        {incidents.map((inc) => (
          <tr key={inc.id}>
            <td>{inc.code}</td>
            <td>
              <Moment format="DD/MM/YYYY hh:mm">{inc.reportedAt}</Moment>
            </td>
            <td>
              <Moment format="DD/MM/YYYY hh:mm">{inc.incidentTime}</Moment>
            </td>
            <td>{inc.location}</td>
            <td>{inc.category}</td>
            <td>{inc.subCategory}</td>
            <td>{inc.incidentType}</td>
            <td>{inc.reportedBy}</td>
            <td>{inc.irInvestigator}</td>
            <td>{inc.status}</td>
            <td>{inc.tat}</td>
            <TableActions
              actions={[
                {
                  icon: <BsPencilFill />,
                  label: "Review IR",
                  callBack: () => {},
                },
                {
                  icon: <FaRegTrashAlt />,
                  label: "Reportable Incident",
                  callBack: () => {},
                },
                {
                  icon: <FaRegTrashAlt />,
                  label: "IR Approval",
                  callBack: () => {},
                },
                {
                  icon: <FaRegTrashAlt />,
                  label: "IR Combine",
                  callBack: () => {},
                },
                {
                  icon: <FaRegTrashAlt />,
                  label: "Assign IR",
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
                {
                  icon: <FaRegTrashAlt />,
                  label: "Cancel IR",
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
const Filters = ({ onSubmit }) => {
  const { handleSubmit, register, watch, reset, setValue } = useForm();
  const [categories, setCategories] = useState([
    { id: 1, name: "cat 1" },
    { id: 2, name: "cat 2" },
    { id: 3, name: "cat 2" },
  ]);
  const [incidentType, setIncidentType] = useState([
    { id: 1, name: "cat 1" },
    { id: 2, name: "cat 2" },
    { id: 3, name: "cat 2" },
  ]);
  const [irInvestigator, setIrInvestigator] = useState([
    { id: 1, name: "cat 1" },
    { id: 2, name: "cat 2" },
    { id: 3, name: "cat 2" },
  ]);
  return (
    <form className={s.filters} onSubmit={handleSubmit(onSubmit)}>
      <Input label="IR Code" name="incidentCode" register={register} />
      <Combobox
        label="Category"
        name="category"
        setValue={setValue}
        watch={watch}
        register={register}
        options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
      />
      <section className={s.pair}>
        <label>Incident Date Range</label>
        <Input
          type="date"
          placeholder="From"
          name="inciDate_from"
          register={register}
        />
        <Input
          type="date"
          placeholder="To"
          name="inciDate_to"
          register={register}
        />
      </section>
      <section className={s.pair}>
        <label>Reporting Date Range</label>
        <Input
          type="date"
          placeholder="From"
          name="inciDate_from"
          register={register}
        />
        <Input
          type="date"
          placeholder="To"
          name="inciDate_to"
          register={register}
        />
      </section>
      <Combobox
        label="Incident Type"
        name="incidentType"
        setValue={setValue}
        watch={watch}
        register={register}
        options={incidentType.map((cat) => ({
          value: cat.id,
          label: cat.name,
        }))}
      />
      <section className={s.pair}>
        <Combobox
          label="IR Investigator"
          name="irInvestigator"
          setValue={setValue}
          watch={watch}
          register={register}
          options={irInvestigator.map((cat) => ({
            value: cat.id,
            label: cat.name,
          }))}
        />
        <Combobox
          label="Status"
          name="status"
          setValue={setValue}
          watch={watch}
          register={register}
          options={[
            { value: "open", label: "Open" },
            { value: "close", label: "Close" },
          ]}
        />
      </section>
      <section className={`${s.pair} ${s.checkboxes}`}>
        <section>
          <input type="checkbox" id="my-irs" name="my-irs" />
          <label htmlFor="my-irs">My IRs</label>
        </section>
        <section>
          <input type="checkbox" id="my-dep-irs" name="my-dep-irs" />
          <label htmlFor="my-dep-irs">My Department IRs</label>
        </section>
      </section>
      <section className={s.btns}>
        <button className="btn secondary">
          <BiSearch /> Search
        </button>
        <button type="button" className={`btn clear ${s.clear}`}>
          Clear
        </button>
      </section>
    </form>
  );
};

const QualityDashboard = ({}) => {
  const [incidents, setIncidents] = useState([
    {
      id: 1,
      code: "40",
      reportedAt: "2021-12-21T15:56:09.153Z",
      incidentTime: "2021-12-21T15:56:09.153",
      location: "OT",
      category: "My Dashboard",
      subCategory: "My Subdashboard",
      incidentType: "Sentinel",
      reportedBy: "John goodman",
      irInvestigator: "Mike",
      status: "Open",
      tat: "5",
    },
    {
      id: 2,
      code: "40",
      reportedAt: "2021-12-21T15:56:09.153Z",
      incidentTime: "2021-12-21T15:56:09.153",
      location: "OT",
      category: "My Dashboard",
      subCategory: "My Subdashboard",
      incidentType: "Sentinel",
      reportedBy: "John goodman",
      irInvestigator: "Mike",
      status: "Open",
      tat: "5",
    },
    {
      id: 3,
      code: "40",
      reportedAt: "2021-12-21T15:56:09.153Z",
      incidentTime: "2021-12-21T15:56:09.153",
      location: "OT",
      category: "My Dashboard",
      subCategory: "My Subdashboard",
      incidentType: "Sentinel",
      reportedBy: "John goodman",
      irInvestigator: "Mike",
      status: "Open",
      tat: "5",
    },
  ]);
  const [filters, setFilters] = useState({});
  return (
    <div className={s.qualityDashboard}>
      <Filters onSubmit={(values) => setFilters(values)} />
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
      >
        {incidents.map((inc) => (
          <tr key={inc.id}>
            <td>{inc.code}</td>
            <td>
              <Moment format="DD/MM/YYYY hh:mm">{inc.reportedAt}</Moment>
            </td>
            <td>
              <Moment format="DD/MM/YYYY hh:mm">{inc.incidentTime}</Moment>
            </td>
            <td>{inc.location}</td>
            <td>{inc.category}</td>
            <td>{inc.subCategory}</td>
            <td>{inc.incidentType}</td>
            <td>{inc.reportedBy}</td>
            <td>{inc.irInvestigator}</td>
            <td>{inc.status}</td>
            <td>{inc.tat}</td>
            <TableActions
              actions={[
                {
                  icon: <BsPencilFill />,
                  label: "Review IR",
                  callBack: () => {},
                },
                {
                  icon: <FaRegTrashAlt />,
                  label: "Reportable Incident",
                  callBack: () => {},
                },
                {
                  icon: <FaRegTrashAlt />,
                  label: "IR Approval",
                  callBack: () => {},
                },
                {
                  icon: <FaRegTrashAlt />,
                  label: "IR Combine",
                  callBack: () => {},
                },
                {
                  icon: <FaRegTrashAlt />,
                  label: "Assign IR",
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
                {
                  icon: <FaRegTrashAlt />,
                  label: "Cancel IR",
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
    </div>
  );
};

export default IncidentReportingDashboard;
