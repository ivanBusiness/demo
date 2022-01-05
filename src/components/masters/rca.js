import { useState, useEffect } from "react";
import { FaInfoCircle, FaPlus, FaCheck, FaRegTrashAlt } from "react-icons/fa";
import { BsPencilFill } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { RiCloseLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { Box } from "../incidentReport";
import {
  Form,
  Input,
  Checkbox,
  Table,
  TableActions,
  Toggle,
} from "../elements";
import { useForm } from "react-hook-form";
import { Modal, Prompt } from "../modal";
import s from "./masters.module.scss";

export default function Rcas() {
  const [selected, setSelected] = useState(null);
  const [rcas, setRcas] = useState([]);
  const [edit, setEdit] = useState(null);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_HOST}/rca`)
      .then((res) => res.json())
      .then((data) => {
        if (data._embedded?.rca) {
          setRcas(data._embedded.rca);
          setSelected(data._embedded.rca[0]?.id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className={s.container}>
      <header>
        <h3>RCA MASTER</h3>
      </header>
      <div className={`${s.content} ${s.parent_child}`}>
        {
          //   <Box label="RCA">
          // </Box>
        }
        <div className={`${s.parent} ${s.rca}`}>
          {
            //   <div className={s.head}>
            //   <Input placeholder="Quick Search" icon={<BiSearch />} />
            // </div>
          }
          <Table
            columns={[
              { label: "Master Name" },
              { label: "Show" },
              { label: "Action" },
            ]}
          >
            <tr>
              <td className={s.inlineForm}>
                <RcaForm
                  {...(edit && { edit })}
                  key={edit ? "edit" : "add"}
                  onSuccess={(newCat) => {
                    setRcas((prev) => {
                      return prev.find((c) => c.id === newCat.id)
                        ? prev.map((c) => (c.id === newCat.id ? newCat : c))
                        : [...prev, newCat];
                    });
                    setEdit(null);
                  }}
                  clearForm={() => {
                    setEdit(null);
                  }}
                  rcas={rcas}
                />
              </td>
            </tr>
            {rcas.map((rca, i) => (
              <tr key={i} className={rca.id === selected ? s.selected : ""}>
                <td>
                  <span
                    className={s.rcaName}
                    onClick={() => setSelected(rca.id)}
                  >
                    {rca.name}
                  </span>
                </td>
                <td>
                  <Toggle readOnly={true} defaultValue={rca.show} />
                </td>
                <TableActions
                  actions={[
                    {
                      icon: <BsPencilFill />,
                      label: "Edit",
                      callBack: () => setEdit(rca),
                    },
                    {
                      icon: <FaRegTrashAlt />,
                      label: "Delete",
                      callBack: () =>
                        Prompt({
                          type: "confirmation",
                          message: `Are you sure you want to remove ${rca.name}?`,
                          callback: () => {
                            fetch(
                              `${process.env.REACT_APP_HOST}/rca/${rca.id}`,
                              { method: "DELETE" }
                            ).then((res) => {
                              if (res.status === 204) {
                                setRcas((prev) =>
                                  prev.filter((c) => c.id !== rca.id)
                                );
                              } else if (res.status === 409) {
                                Prompt({
                                  type: "error",
                                  message:
                                    "Remove children to delete this master.",
                                });
                              }
                            });
                          },
                        }),
                    },
                  ]}
                />
              </tr>
            ))}
          </Table>
        </div>
        {rcas.find((cat) => cat.id === selected) && (
          <RcaCauses
            rca={rcas.find((cat) => cat.id === selected)}
            setRcas={setRcas}
          />
        )}
      </div>
    </div>
  );
}
const RcaForm = ({ edit, onSuccess, clearForm, rcas }) => {
  const { handleSubmit, register, reset, watch } = useForm({ ...edit });
  useEffect(() => {
    reset({ ...edit });
  }, [edit]);
  return (
    <form
      onSubmit={handleSubmit((data) => {
        const url = `${process.env.REACT_APP_HOST}/rca${
          edit ? `/${edit.id}` : ""
        }`;
        if (
          !edit &&
          rcas?.some(
            (item) =>
              item.name.trim().toLowerCase() === data.name.trim().toLowerCase()
          )
        ) {
          Prompt({
            type: "information",
            message: `${data.name} already exists.`,
          });
          return;
        }
        fetch(url, {
          method: edit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.name) {
              onSuccess(data);
              reset();
            }
          });
      })}
    >
      <Input name="name" register={register} required={true} />
      <Toggle name="show" register={register} required={true} watch={watch} />
      <div className={s.btns}>
        <button className="btn secondary">
          {edit ? <FaCheck /> : <FaPlus />}
        </button>
        {edit && (
          <button
            type="button"
            onClick={() => {
              clearForm();
            }}
            className="btn secondary"
          >
            <IoClose />
          </button>
        )}
      </div>
    </form>
  );
};

const RcaCauses = ({ rca: { id, name, rcaCauses }, setRcas }) => {
  const [edit, setEdit] = useState(null);
  // <Box label="RCA CAUSES">
  // </Box>
  return (
    <div className={s.child}>
      <div className={s.head}>
        <span className={s.rcaName}>
          Master name: <strong>{name}</strong>
        </span>
      </div>
      <Table columns={[{ label: "Description" }, { label: "Action" }]}>
        <tr>
          <td className={s.inlineForm}>
            <RcaCauseForm
              {...(edit && { edit })}
              key={edit ? "edit" : "add"}
              rcaId={id}
              onSuccess={(rcaCause) => {
                if (edit) {
                  setRcas((prev) =>
                    prev.map((cat) => {
                      const newRcaCauses = cat.rcaCauses?.find(
                        (sc) => sc.id === rcaCause.id
                      )
                        ? cat.rcaCauses?.map((sc) =>
                            sc.id === rcaCause.id ? rcaCause : sc
                          )
                        : [...(cat.rcaCauses || []), rcaCause];
                      return cat.id === id
                        ? {
                            ...cat,
                            rcaCauses: newRcaCauses,
                          }
                        : cat;
                    })
                  );
                } else {
                  setRcas((prev) =>
                    prev.map((cat) =>
                      cat.id === id
                        ? {
                            ...cat,
                            rcaCauses: [...(cat.rcaCauses || []), rcaCause],
                          }
                        : cat
                    )
                  );
                }
                setEdit(null);
              }}
              clearForm={() => {
                setEdit(null);
              }}
              rcaCauses={rcaCauses}
            />
          </td>
        </tr>
        {(rcaCauses || []).map((rca, i) => (
          <tr key={i}>
            <td>{rca.name}</td>
            <TableActions
              actions={[
                {
                  icon: <BsPencilFill />,
                  label: "Edit",
                  callBack: () => setEdit(rca),
                },
                {
                  icon: <FaRegTrashAlt />,
                  label: "Delete",
                  callBack: () =>
                    Prompt({
                      type: "confirmation",
                      message: `Are you sure you want to remove ${rca.name}?`,
                      callback: () => {
                        fetch(
                          `${process.env.REACT_APP_HOST}/rcaCauses/${rca.id}`,
                          { method: "DELETE" }
                        ).then((res) => {
                          if (res.status === 204) {
                            setRcas((prev) =>
                              prev.map((cat) =>
                                cat.id === id
                                  ? {
                                      ...cat,
                                      rcaCauses: cat.rcaCauses.filter(
                                        (c) => c.id !== rca.id
                                      ),
                                    }
                                  : cat
                              )
                            );
                          } else if (res.status === 409) {
                            Prompt({
                              type: "error",
                              message: "Remove children to delete this master.",
                            });
                          }
                        });
                      },
                    }),
                },
              ]}
            />
          </tr>
        ))}
      </Table>
    </div>
  );
};
const RcaCauseForm = ({ edit, rcaId, onSuccess, clearForm, rcaCauses }) => {
  const { handleSubmit, register, reset } = useForm({ ...edit });
  useEffect(() => {
    reset({ ...edit });
  }, [edit]);
  return (
    <form
      onSubmit={handleSubmit((data) => {
        if (
          !edit &&
          rcaCauses?.some(
            (item) =>
              item.name.trim().toLowerCase() === data.name.trim().toLowerCase()
          )
        ) {
          Prompt({
            type: "information",
            message: `${data.name} already exists.`,
          });
          return;
        }
        fetch(`${process.env.REACT_APP_HOST}/rcaCauses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, rca: { id: rcaId } }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.name) {
              onSuccess(data);
              reset();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })}
    >
      <Input
        register={register}
        required={true}
        name="name"
        placeholder="Enter"
      />
      <div className={s.btns}>
        <button className="btn secondary">
          {edit ? <FaCheck /> : <FaPlus />}
        </button>
        {edit && (
          <button
            type="button"
            onClick={() => {
              reset();
              clearForm();
            }}
            className="btn secondary"
          >
            <IoClose />
          </button>
        )}
      </div>
    </form>
  );
};
